import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FC } from "react"
import { userService } from "@modules/user/services";
import { AccessType } from "@modules/auth/enums/AccessType";
import normalizeUserAccess from "@modules/auth/utils/normilizeUserAccess";
import validateUserAccess from "@modules/auth/utils/validateUserAcess";
import { createClient } from "@utils/supabase/server";

interface IProps {
    children: React.ReactNode
    access?: AccessType | AccessType[];
}

export const AuthGuard: FC<IProps> = async ({ children, access }) => {
    const headersMap = await headers();
    const currentPathname = headersMap.get('x-pathname') ?? '/';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        if (currentPathname === '/login') {
            return children;
        }
        redirect('/login');
    }

    const currentUser = await userService.fetchCurrentUser();

    if (currentUser === null) {
        redirect('/login');
    }

    const allowedAccess = normalizeUserAccess(access);
    const hasAccess = validateUserAccess(currentUser!.role, allowedAccess);

    if (!hasAccess) {
        redirect('/forbidden');
    }

    return children;
}
