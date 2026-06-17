'use client'

import { redirect } from "next/navigation";
import { FC } from "react"
import { useUser } from "@modules/user";
import { AccessType } from "@modules/auth/enums/AccessType";
import validateUserAccess from "@modules/auth/utils/validateUserAccess";
import normalizeAllowedAccess from "@modules/auth/utils/normalizeAllowedAccess";

interface IProps {
    children: React.ReactNode
    access?: AccessType | AccessType[];
}

export const AuthGuard: FC<IProps> = ({ children, access }) => {
    const { user } = useUser();

    if (user === null) {
        redirect('/login');
    }

    const allowedAccess = normalizeAllowedAccess(access);
    const hasAccess = validateUserAccess(user.role, allowedAccess);

    if (!hasAccess) {
        redirect('/forbidden');
    }

    return children;
}