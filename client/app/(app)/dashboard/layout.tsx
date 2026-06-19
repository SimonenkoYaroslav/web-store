import { PropsWithChildren } from 'react'

import { AccessType } from '@modules/auth/enums/AccessType'
import { MainLayout } from '@modules/common/layouts/MainLayout'

export default async function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <MainLayout access={AccessType.ADMIN}>{children}</ MainLayout >
    )
}
