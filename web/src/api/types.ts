export type IdValue = {
    id: number;
}

export type Password = {
    id: number;
    value: string;
    role: string;
}

export type PasswordDetails = {
    accessPassword: Password;
    isUsed: boolean;
}

export type User = {
    id: number;
    name: string;
    email: string;
    mobile: string;
    tickets: number;
    passwordUsed: Password;
}

export type UpdateTicketCountRequest = {
    id: number;
    tickets: number;
}

export type Raffle = {
    id: number;
    winnerName: string;
    winnerTickets: number;
    date: string; // ToDo!!
}

export type WelcomePage = {
    title: string | null;
    description: string | null;
    image: string | null;
}

export type CreateUserRequest = {
    name: string;
    email: string;
    mobile: string;
}

export type UserRoleResult = {
    role: UserRole;
}

export type BooleanResult = {
    value: boolean;
}

export enum UserRole {
    Admin = "Admin",
    User = "User"
}

export class APIError {
    public status: number;
    public data: object | undefined;


    public constructor(status: number, data: object | undefined = undefined) {
        this.status = status;
        this.data = data;
    } 
}