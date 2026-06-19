import { FC } from "react"

import { AccessType } from "@modules/auth/enums/AccessType"
import { MainLayout } from "@modules/common/layouts/MainLayout"

interface IProps {
    children: React.ReactNode
}

const CatalogLayout: FC<IProps> = ({ children }) => {
    return (
        <MainLayout access={[AccessType.USER, AccessType.ADMIN]}>{children} </MainLayout>
    )
}

export default CatalogLayout;
