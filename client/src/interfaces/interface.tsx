interface Task {
    id: string;
    status: string;
    description: string;
    created_at: string;
}

interface GetTasksData {
    tasks: Task[];
}

export type { Task, GetTasksData };
