import { PropsWithChildren } from 'react'

import { MainLayout } from '@modules/common/layouts/MainLayout'
import { UserRole } from '@modules/user/enums/UserRole'

export default async function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <MainLayout access={UserRole.ADMIN}>{children}</ MainLayout >
    )
}
