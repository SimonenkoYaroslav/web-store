import { FC } from "react"

import { MainLayout } from "@modules/common/layouts/MainLayout"
import { UserRole } from "@modules/user/enums/UserRole"

interface IProps {
    children: React.ReactNode
}

const CatalogLayout: FC<IProps> = ({ children }) => {
    return (
        <MainLayout access={[UserRole.USER, UserRole.ADMIN]}>{children} </MainLayout>
    )
}

export default CatalogLayout;
