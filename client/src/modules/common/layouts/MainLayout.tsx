import { FC, PropsWithChildren } from "react"

import { Navbar } from "@common/components"
import { AuthGuard } from "@modules/auth/layouts/AuthGuard"
import { UserRole } from "@modules/user/enums/UserRole"

type IProps = PropsWithChildren<{
    access: UserRole | UserRole[]
    children: React.ReactNode
}>

export const MainLayout: FC<IProps> = (props) => {
    const { children, access } = props
    return (
        <AuthGuard access={access}>
            <div className="flex">
                <Navbar />
                {children}
            </div>
        </AuthGuard>
    )
}
