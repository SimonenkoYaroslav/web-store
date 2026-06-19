'use client'

import { useState } from 'react';
import { filterNavItemsByAccess } from './utils/filterNavItemsByAccess';
import { NavbarHeader } from './components/NavbarHeader';
import { NavbarMenu } from './components/NavbarMenu';
import { ProfileCard } from '@modules/user/components/ProfileCard';
import { useUser } from '@modules/user/contexts/UserContext';



const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useUser()
    const items = filterNavItemsByAccess(user?.role)

    return (
        <nav className={`bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col shrink-0 overflow-hidden transition-[width] duration-200 ${isOpen ? 'w-56' : 'w-14'}`}>
            <NavbarHeader isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <NavbarMenu isOpen={isOpen} items={items} />
            <ProfileCard isOpen={isOpen} />
        </nav>
    )
}

export default Navbar
