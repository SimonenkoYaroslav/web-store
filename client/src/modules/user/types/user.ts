import { UserRole } from "@user/enums/UserRole";

export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: UserRole;
}
