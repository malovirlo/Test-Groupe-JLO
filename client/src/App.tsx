import { useQuery, useMutation, gql } from "@apollo/client";
import "./index.css";
import { useState } from "react";
import React from "react";
import {
    FiArchive,
    FiCheckCircle,
    FiEdit,
    FiCornerUpLeft,
    FiCircle,
    FiPlusCircle,
} from "react-icons/fi";

const GET_TASKS = gql`
    query GetTasks {
        tasks {
            id
            status
            description
            created_at
        }
    }
`;

const ADD_TASK = gql`
    mutation CreateTask(
        $description: String!
        $status: TaskStatus!
        $tag_ids: [ID!]
    ) {
        createTask(
            description: $description
            status: $status
            tag_ids: $tag_ids
        ) {
            id
            description
            status
            created_at
        }
    }
`;

const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
        deleteTask(id: $id) {
            id
            status
            description
            created_at
        }
    }
`;

interface Task {
    id: string;
    status: string;
    description: string;
    created_at: string;
}

interface GetTasksData {
    tasks: Task[];
}

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

    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskStatus, setNewTaskStatus] = useState("IN_PROGRESS");

    const handleAddTask = () => {
        if (newTaskDescription.trim()) {
            addTask({
                variables: {
                    description: newTaskDescription,
                    status: newTaskStatus,
                },
            });
            setNewTaskDescription("");
            setNewTaskStatus("IN_PROGRESS");
        }
    };

    const handleDeleteTask = (id: string) => {
        console.log("ID to delete:", id);
        deleteTask({ variables: { id: id } });
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
        <div className="flex gap-5">
            <div className="flex flex-col items-center mt-4 w-[50%]">
                <h1 className="uppercase text-green-600">TACHES EN COURS</h1>
                <ul className="flex flex-col gap-5 m-5">
                    {inProgressTasks.map(
                        (task: {
                            id: string;
                            status: string;
                            description: string;
                            created_at: string;
                        }) => (
                            <React.Fragment key={task.id}>
                                <li className="flex items-center">
                                    {task.description} -{" "}
                                    {formatDate(task.created_at)}
                                    <FiCircle className="ml-2 cursor-pointer text-green-600" />
                                    <FiEdit className="ml-2 cursor-pointer text-blue-600" />
                                    <FiArchive
                                        onClick={() =>
                                            handleDeleteTask(task.id)
                                        }
                                        className="ml-2 cursor-pointer text-red-600"
                                    />
                                </li>
                            </React.Fragment>
                        )
                    )}
                    <li className="flex items-center gap-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddTask();
                            }}
                        >
                            <input
                                className="border-2 border-gray-300 rounded-md p-1"
                                placeholder="Ajouter une tâche"
                                value={newTaskDescription}
                                onChange={(e) =>
                                    setNewTaskDescription(e.target.value)
                                }
                            />
                        </form>
                        <FiPlusCircle
                            onClick={handleAddTask}
                            className="inline-block mr-2 w-6 h-6"
                        />
                    </li>
                </ul>
            </div>
            <div className="flex flex-col items-center mt-4 w-[50%]">
                <h1 className="uppercase text-red-600">TACHES TERMINÉES</h1>
                <ul className="flex flex-col gap-5 m-5">
                    {completedTasks.map(
                        (task: {
                            id: string;
                            status: string;
                            description: string;
                            created_at: string;
                        }) => (
                            <li key={task.id} className="flex items-center">
                                {task.description} -{" "}
                                {formatDate(task.created_at)}
                                <FiCheckCircle className="ml-2 cursor-pointer text-green-600" />
                                <FiCornerUpLeft className="ml-2 cursor-pointer text-blue-600" />
                                <FiArchive
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="ml-2 cursor-pointer text-red-600"
                                />
                            </li>
                        )
                    )}
                </ul>
            </div>
        </div>
    );
}

export default App;
