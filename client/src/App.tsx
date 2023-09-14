import { useQuery, gql } from "@apollo/client";
import "./index.css";

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

function App() {
    const { loading, error, data } = useQuery(GET_TASKS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois sont indexés à 0
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
            <div className="flex flex-col items-center">
                <h1 className="uppercase text-green-600">TACHE À FAIRE</h1>
                <ul className="flex flex-col gap-5 m-5">
                    {inProgressTasks.map(
                        (task: {
                            id: number;
                            status: string;
                            description: string;
                            created_at: string;
                        }) => (
                            <li key={task.id}>
                                {task.description} -{" "}
                                {formatDate(task.created_at)}
                            </li>
                        )
                    )}
                </ul>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="uppercase text-red-600">TACHE TERMINER</h1>
                <ul className="flex flex-col gap-5 m-5">
                    {completedTasks.map(
                        (task: {
                            id: number;
                            status: string;
                            description: string;
                            created_at: string;
                        }) => (
                            <li key={task.id}>
                                {task.description} -{" "}
                                {formatDate(task.created_at)}
                            </li>
                        )
                    )}
                </ul>
            </div>
        </div>
    );
}

export default App;
