export type User = {
    id: string;
    username: string;
    email: string;
    name: string;
    password?: string; // for dummy data
}

export type Admin = {
    id: string;
    email: string;
}