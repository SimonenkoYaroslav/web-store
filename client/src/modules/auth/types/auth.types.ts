import { IUser } from "@modules/user/types/user";

export interface ISignIn {
    email: string;
    password: string;
}

export interface ISignUp extends ISignIn, Pick<IUser, 'firstName' | 'lastName'> {}
