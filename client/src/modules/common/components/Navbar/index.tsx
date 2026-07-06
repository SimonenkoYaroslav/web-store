'use client'

import { useState } from 'react';

import navigationService from '@common/service/navigation.service';
import { ProfileCard } from '@modules/user/components/ProfileCard';
import { useUser } from '@modules/user/contexts/UserContext';

import { NavbarHeader } from './components/NavbarHeader';
import { NavbarMenu } from './components/NavbarMenu';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useUser()
    const items = navigationService.filterNavItemsByAccess(user?.role)

    return (
        <nav className={`bg-brand-950 border-r-4 border-brand-900 min-h-screen flex flex-col shrink-0 overflow-hidden transition-[width] duration-200 ${isOpen ? 'w-56' : 'w-14'}`}>
            <NavbarHeader isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <NavbarMenu isOpen={isOpen} items={items} />
            <ProfileCard isOpen={isOpen} />
        </nav>
    )
}

export default Navbar
