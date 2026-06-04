import { AccessType } from '@modules/auth/enums/AccessType'
import { AuthGuard } from '@modules/auth/layouts/AuthGuard'

interface IProps {
    children: React.ReactNode,
}

export default async function DashboardLayout({ children }: IProps) {
    return (
        <div><AuthGuard access={AccessType.ADMIN}>{children}</AuthGuard></div>
    )
}
