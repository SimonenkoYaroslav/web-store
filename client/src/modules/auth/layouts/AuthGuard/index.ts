'use client'

import { redirect } from "next/navigation";
import { FC } from "react"

import { accessService } from "@modules/auth/services";
import { useUser } from "@modules/user";
import { UserRole } from "@modules/user/enums/UserRole";

interface IProps {
    children: React.ReactNode
    access?: UserRole | UserRole[];
}

export const AuthGuard: FC<IProps> = ({ children, access }) => {
    const { user } = useUser();

    if (user === null) {
        redirect('/login');
    }

    const hasAccess = accessService.canAccess(user.role, access);

    if (!hasAccess) {
        redirect('/forbidden');
    }

    return children;
}
