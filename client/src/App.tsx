import { useQuery, useMutation } from "@apollo/client";
import { GetTasksData, Task } from "./interfaces/interfaces";
import {
    GET_TASKS,
    ADD_TASK,
    UPDATE_TASK,
    DELETE_TASK,
    DELETE_TASKS_BY_STATUS,
} from "./graphql/queries";
import "./index.css";
import { useState } from "react";
import React from "react";
import {
    FiArchive,
    FiCheckCircle,
    FiCornerUpLeft,
    FiCircle,
    FiPlusCircle,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import TagsModal from "./components/TagsModal";

function App() {
    const { loading, error, data } = useQuery(GET_TASKS);
    const [addTask] = useMutation(ADD_TASK, {
        update(cache, { data: { createTask } }) {
            const existingData = cache.readQuery<GetTasksData>({
                query: GET_TASKS,
            });
            if (existingData) {
                cache.writeQuery({
                    query: GET_TASKS,
                    data: {
                        tasks: [...existingData.tasks, createTask],
                    },
                });
            }
        },
    });

    const [deleteTask] = useMutation(DELETE_TASK, {
        update(cache, { data: { deleteTask } }) {
            const existingData = cache.readQuery<GetTasksData>({
                query: GET_TASKS,
            });
            if (existingData) {
                cache.writeQuery({
                    query: GET_TASKS,
                    data: {
                        tasks: existingData.tasks.filter(
                            (task) => task.id !== deleteTask.id
                        ),
                    },
                });
            }
        },
    });

    const [deleteTasksByStatus] = useMutation(DELETE_TASKS_BY_STATUS, {
        update(cache, { data: {} }) {
            const existingData = cache.readQuery<GetTasksData>({
                query: GET_TASKS,
            });
            if (existingData) {
                cache.writeQuery({
                    query: GET_TASKS,
                    data: {
                        tasks: existingData.tasks.filter(
                            (task) => task.status !== "COMPLETED"
                        ),
                    },
                });
            }
        },
    });

    const [updateTask] = useMutation(UPDATE_TASK, {
        update(cache, { data: { updateTask } }) {
            const existingData = cache.readQuery<GetTasksData>({
                query: GET_TASKS,
            });
            if (existingData) {
                cache.writeQuery({
                    query: GET_TASKS,
                    data: {
                        tasks: existingData.tasks.map((task) =>
                            task.id === updateTask.id ? updateTask : task
                        ),
                    },
                });
            }
        },
    });

    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskStatus, setNewTaskStatus] = useState("IN_PROGRESS");
    const [showTagsModal, setShowTagsModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState("");

    const handleAddTask = () => {
        if (newTaskDescription.trim()) {
            addTask({
                variables: {
                    description: newTaskDescription,
                    status: newTaskStatus,
                },
            });
            toast.success("Tâche ajoutée avec succès !");
            setNewTaskDescription("");
            setNewTaskStatus("IN_PROGRESS");
        }
    };

    const handleDeleteTask = (id: string) => {
        console.log("ID to delete:", id);
        deleteTask({ variables: { id: id } });
        toast.error("Tâche supprimée avec succès !");
    };

    const handleDeleteAllTasks = () => {
        console.log("Deleting all completed tasks");
        deleteTasksByStatus({ variables: { status: "COMPLETED" } });
        toast.error("Tâches supprimées avec succès !");
    };

    const handleUpdateTask = (task: Task) => {
        console.log("ID to update:", task.id);
        console.log("Task to update:", task);
        updateTask({
            variables: {
                id: task.id,
                status: task.status,
                description: task.description,
                created_at: task.created_at,
            },
        });
        toast.info("Tâche mise à jour avec succès !");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `Le ${year}-${month}-${day} à ${hours}:${minutes}`;
    }

    const inProgressTasks = data.tasks.filter(
        (task: { status: string }) => "IN_PROGRESS" === task.status
    );
    const completedTasks = data.tasks.filter(
        (task: { status: string }) => "COMPLETED" === task.status
    );

    return (
        <>
            <Header />

            <div className="flex gap-5 mx-4">
                <div className="flex flex-col items-center mt-4 w-[50%] border-2 rounded-2xl shadow-md h-[calc(100vh-7rem)]">
                    <h1 className="uppercase text-green-600 text-xl border-b-2 border-green-400 mt-2">
                        TACHES EN COURS
                    </h1>
                    <ul className="flex flex-col items-center gap-5 m-5 w-full flex-grow overflow-y-auto">
                        {inProgressTasks.map(
                            (task: {
                                id: string;
                                status: string;
                                description: string;
                                created_at: string;
                            }) => (
                                <React.Fragment key={task.id}>
                                    <li className="flex justify-between items-center border-b w-full pb-2 px-4">
                                        {task.description} -{" "}
                                        {formatDate(task.created_at)}
                                        <div className="flex items-center gap-2">
                                            <FiCircle
                                                onClick={() =>
                                                    handleUpdateTask({
                                                        id: task.id,
                                                        status: "COMPLETED",
                                                        description:
                                                            task.description,
                                                        created_at:
                                                            task.created_at,
                                                    })
                                                }
                                                className="cursor-pointer text-green-600 min-w-fit"
                                                title="Marquer la tâche comme terminée"
                                            />
                                            <FiPlusCircle
                                                onClick={() => {
                                                    setSelectedTaskId(task.id);
                                                    setShowTagsModal(true);
                                                }}
                                                className="cursor-pointer"
                                                title="Assigner à un tag"
                                            />
                                            <FiArchive
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
                                                }
                                                className="cursor-pointer text-red-600 min-w-fit"
                                                title="Supprimer la tâche"
                                            />
                                        </div>
                                    </li>
                                </React.Fragment>
                            )
                        )}
                    </ul>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTask();
                        }}
                        className="flex justify-center items-center w-full mb-4 gap-2"
                    >
                        <input
                            className="border-2 border-gray-300 rounded-md p-1"
                            placeholder="Ajouter une tâche"
                            value={newTaskDescription}
                            onChange={(e) =>
                                setNewTaskDescription(e.target.value)
                            }
                        />
                        <FiPlusCircle
                            onClick={handleAddTask}
                            className="inline-block mr-2 w-6 h-6 cursor-pointer text-green-600 hover:text-green-800"
                        />
                    </form>
                </div>
                <div className="flex flex-col items-center mt-4 w-[50%] border-2 rounded-2xl shadow-md h-[calc(100vh-7rem)]">
                    <h1 className="uppercase text-red-600 text-xl border-b-2 border-red-400 mt-2">
                        TACHES TERMINÉES
                    </h1>
                    <ul className="flex flex-col items-center gap-5 m-5 w-full flex-grow overflow-y-auto">
                        {completedTasks.map(
                            (task: {
                                id: string;
                                status: string;
                                description: string;
                                created_at: string;
                            }) => (
                                <li
                                    key={task.id}
                                    className="flex justify-between items-center border-b w-full pb-2 px-4"
                                >
                                    {task.description} -{" "}
                                    {formatDate(task.created_at)}
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-green-600" />
                                        <FiCornerUpLeft
                                            onClick={() =>
                                                handleUpdateTask({
                                                    id: task.id,
                                                    status: "IN_PROGRESS",
                                                    description:
                                                        task.description,
                                                    created_at: task.created_at,
                                                })
                                            }
                                            className="cursor-pointer text-blue-600"
                                            title="Remettre la tâche en cours"
                                        />
                                        <FiArchive
                                            onClick={() =>
                                                handleDeleteTask(task.id)
                                            }
                                            className="cursor-pointer text-red-600"
                                            title="Supprimer la tâche"
                                        />
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                    <button
                        onClick={handleDeleteAllTasks}
                        className="ml-2 cursor-pointer text-red-600 border border-red-600 rounded-full px-4 hover:bg-red-600 hover:text-white mb-4"
                    >
                        Vider la corbeille
                    </button>
                    <ToastContainer />
                </div>
            </div>
            <TagsModal
                showModal={showTagsModal}
                setShowModal={setShowTagsModal}
                taskId={selectedTaskId}
            />
        </>
    );
}

export default App;
