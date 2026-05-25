import { authService } from "@modules/auth/services";
import { CookieKey } from "@modules/common/enums/CookieyKey";
import { UserRole } from "@modules/user/enums/UserRole";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { FC } from "react"
import { userService } from "@modules/user/services";

interface IProps {
    children: React.ReactNode
}

export const AuthProvider: FC<IProps> = async ({ children }) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(CookieKey.ACCESS_TOKEN)?.value;

    const headersMap = await headers();
    const path = headersMap.get('x-path');
    const currentUrl = !!path ? new URL(path) : null;
    const currentPathname = (currentUrl)?.pathname ?? path;

    if (!accessToken && currentPathname === '/login') {
        return children;
    }

    if (!accessToken) {
        redirect('/login');
    }

    const currentUser = await userService.fetchCurrentUser(accessToken);

    if (currentUser === null && currentPathname !== '/login') {
        redirect('/login');
    }

    const { user_metadata: { role } } = currentUser;

    if (role === UserRole.ADMIN) {
        redirect('/dashboard');
    }

    if (role === UserRole.USER) {
        redirect('/catalog');
    }

    return children;
}
