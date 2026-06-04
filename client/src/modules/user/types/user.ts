import { UserRole } from "../enums/UserRole";

export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: UserRole;
}