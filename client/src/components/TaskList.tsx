import { useQuery, gql } from "@apollo/client";

const GET_TASKS = gql`
    query GetTasks {
        tasks {
            id
            status
            description
        }
    }
`;

function TaskList() {
    const { loading, error, data } = useQuery(GET_TASKS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <ul>
            {data.tasks.map(
                (task: { id: string; status: string; description: string }) => (
                    <li key={task.id}>
                        {task.description} - {task.status}
                    </li>
                )
            )}
        </ul>
    );
}

export default TaskList;
