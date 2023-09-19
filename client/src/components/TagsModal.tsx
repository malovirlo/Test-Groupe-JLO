import { FormEvent, useEffect, useState, useRef } from "react";
import { TagsModalProps, Tag, GetTagsData } from "../interfaces/interfaces";
import { FiArchive, FiPlusCircle, FiXCircle } from "react-icons/fi";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TAGS, ADD_TAG, DELETE_TAG } from "../graphql/queries";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TagsModal({ showModal, setShowModal }: TagsModalProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [name, setName] = useState<string>("");
    const [colorCode, setColorCode] = useState<string>("#000000");

    const { loading, error, data } = useQuery(GET_TAGS);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowModal(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [setShowModal]);

    useEffect(() => {
        if (data && data.tags) {
            setTags(data.tags);
        }
    }, [data]);

    const [addTag] = useMutation(ADD_TAG, {
        update(cache, { data: { createTag } }) {
            const existingData = cache.readQuery<GetTagsData>({
                query: GET_TAGS,
            });
            if (existingData) {
                cache.writeQuery({
                    query: GET_TAGS,
                    data: { tags: [...existingData.tags, createTag] },
                });
            }
        },
    });

    const handleAddTag = () => {
        if (name.trim() || colorCode.trim()) {
            addTag({
                variables: { name, color_code: colorCode },
            });
            toast.success("Tag ajouté avec succès");
        }
    };

    const [deleteTag] = useMutation(DELETE_TAG, {
        update(cache, { data: { deleteTag } }) {
            const existingData = cache.readQuery<GetTagsData>({
                query: GET_TAGS,
            });
            if (existingData) {
                cache.writeQuery({
                    query: GET_TAGS,
                    data: {
                        tags: existingData.tags.filter(
                            (tag) => tag.id !== deleteTag.id
                        ),
                    },
                });
            }
        },
    });

    const handleDeleteTag = (id: string) => {
        deleteTag({ variables: { id } });
        toast.error("Tag supprimé avec succès");
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        handleAddTag();
        setName("");
        setColorCode("#000000");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            {showModal && (
                <div
                    className={`relative z-10 ${
                        showModal ? "opacity-100" : "opacity-0"
                    } transition-opacity ease-out duration-300`}
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className={`fixed inset-0 bg-gray-500 bg-opacity-75 ${
                            showModal ? "opacity-100" : "opacity-0"
                        } transition-opacity ease-out duration-300`}
                    ></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div
                            onClick={() => setShowModal(false)}
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl ${
                                    showModal
                                        ? "opacity-100 translate-y-0 scale-100"
                                        : "opacity-0 translate-y-4 scale-95"
                                } transition-all ease-out duration-300 sm:my-8 sm:w-full sm:max-w-lg`}
                            >
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        type="button"
                                    >
                                        <FiXCircle className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3
                                                className="text-base font-semibold leading-6 text-gray-900"
                                                id="modal-title"
                                            >
                                                Choisir un tag
                                            </h3>
                                            <div className="mt-2">
                                                <ul>
                                                    {tags.map((tag, index) => (
                                                        <li
                                                            className="flex items-center gap-2"
                                                            key={`tag-${index}`}
                                                        >
                                                            <span
                                                                className="block w-4 h-4 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        tag.color_code,
                                                                }}
                                                            ></span>
                                                            <span>
                                                                {tag.name}
                                                            </span>
                                                            <FiPlusCircle className="text-green-600 cursor-pointer" />
                                                            <FiArchive
                                                                onClick={() =>
                                                                    handleDeleteTag(
                                                                        tag.id as string
                                                                    )
                                                                }
                                                                className="text-red-600 cursor-pointer"
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <form
                                                onSubmit={handleSubmit}
                                                className="flex justify-center items-center w-full mb-4 gap-2"
                                                ref={formRef}
                                            >
                                                <input
                                                    type="color"
                                                    value={colorCode}
                                                    onChange={(event) =>
                                                        setColorCode(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    className="border-2 border-gray-300 rounded-md p-1"
                                                    placeholder="Ajouter un tag"
                                                    type="text"
                                                    value={name}
                                                    onChange={(event) =>
                                                        setName(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                                <FiPlusCircle
                                                    onClick={handleAddTag}
                                                    className="inline-block mr-2 w-6 h-6 cursor-pointer text-green-600 hover:text-green-800"
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TagsModal;
