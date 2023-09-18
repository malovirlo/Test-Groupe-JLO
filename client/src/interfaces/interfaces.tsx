export interface Task {
    id: string;
    status: string;
    description: string;
    created_at: string;
}

export interface GetTasksData {
    tasks: Task[];
}

export interface TagsModalProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    taskId: string;
}

export interface Tag {
    name: string;
    color_code: string;
    id?: string;
}

export interface GetTagsData {
    tags: Tag[];
}
