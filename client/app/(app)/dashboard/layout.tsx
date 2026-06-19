import { AccessType } from '@modules/auth/enums/AccessType'
import { MainLayout } from '@modules/common/layouts/MainLayout'
import { PropsWithChildren } from 'react'


export default async function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <MainLayout access={AccessType.ADMIN}>{children}</ MainLayout >
    )
}
