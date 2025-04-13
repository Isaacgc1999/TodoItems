import { Progression } from "./progression";

export interface TodoItem {
    id: number;
    title: string;
    description: string;
    category: string;
    progressions: Progression[];
    totalProgress: number;
}

export interface CreateTodoItem {
    title: string;
    description: string;
    category: string;
}

export interface UpdateTodoItem {
    id: number;
    title: string;
    description: string;
    category: string;
    progressions: Progression[];
}

