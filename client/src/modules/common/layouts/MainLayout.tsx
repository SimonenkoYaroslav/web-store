import { FC, PropsWithChildren } from "react"

import { AccessType } from "@modules/auth/enums/AccessType"
import { AuthGuard } from "@modules/auth/layouts/AuthGuard"

import { Navbar } from "../components"

type IProps = PropsWithChildren<{
    access: AccessType | AccessType[]
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
