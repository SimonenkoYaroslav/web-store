'use client'

import { useState } from 'react'
import { IUser } from '@modules/user/types/user'
import { UserRole } from '@modules/user/enums/UserRole'
import { NavbarHeader } from './NavbarHeader'
import { NavbarMenu } from './NavbarMenu'
import { ProfileCard } from './ProfileCard'

interface IProps {
    user: IUser | null
}

export const NavbarClient = ({ user }: IProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const isAdmin = user?.role === UserRole.ADMIN

    return (
        <nav className={`bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col shrink-0 overflow-hidden transition-[width] duration-200 ${isOpen ? 'w-56' : 'w-14'}`}>
            <NavbarHeader isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <NavbarMenu isOpen={isOpen} isAdmin={isAdmin} />
            <ProfileCard isOpen={isOpen} user={user} />
        </nav>
    )
}
