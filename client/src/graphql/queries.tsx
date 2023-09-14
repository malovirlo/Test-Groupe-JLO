import { gql } from "@apollo/client";

export const GET_TASKS = gql`
    query GetTasks {
        tasks {
            id
            status
            description
            created_at
        }
    }
`;

export const ADD_TASK = gql`
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

export const UPDATE_TASK = gql`
    mutation UpdateTask(
        $id: ID!
        $description: String!
        $status: TaskStatus!
        $tag_ids: [ID!]
    ) {
        updateTask(
            id: $id
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

export const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
        deleteTask(id: $id) {
            id
            status
            description
            created_at
        }
    }
`;

export const DELETE_TASKS_BY_STATUS = gql`
    mutation DeleteTasksByStatus($status: TaskStatus!) {
        deleteTaskByStatus(status: $status) {
            id
            status
            description
            created_at
        }
    }
`;
