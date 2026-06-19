import { AccessType } from "@modules/auth/enums/AccessType"
import { MainLayout } from "@modules/common/layouts/MainLayout"
import { FC } from "react"

interface IProps {
    children: React.ReactNode
}

const CatalogLayout: FC<IProps> = ({ children }) => {
    return (
        <MainLayout access={[AccessType.USER, AccessType.ADMIN]}>{children} </MainLayout>
    )
}

export default CatalogLayout;