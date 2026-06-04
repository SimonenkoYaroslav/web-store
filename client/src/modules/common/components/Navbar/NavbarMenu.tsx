'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tooltip } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import DashboardIcon from '@mui/icons-material/Dashboard'

interface IProps {
    isOpen: boolean
    isAdmin: boolean
}

export const NavbarMenu = ({ isOpen, isAdmin }: IProps) => {
    const pathname = usePathname()

    const linkClass = (href: string) =>
        `flex items-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
            pathname.startsWith(href)
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`

    const iconLinkClass = (href: string) =>
        `w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150 ${
            pathname.startsWith(href)
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`

    return (
        <div className={`flex flex-col gap-1 p-3 flex-1 ${isOpen ? '' : 'items-center'}`}>
            {isOpen ? (
                <>
                    <Link href="/catalog" className={linkClass('/catalog')}>Catalog</Link>
                    {isAdmin && (
                        <Link href="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                    )}
                </>
            ) : (
                <>
                    <Tooltip title="Catalog" placement="right">
                        <Link href="/catalog" className={iconLinkClass('/catalog')}>
                            <GridViewIcon sx={{ fontSize: 16 }} />
                        </Link>
                    </Tooltip>
                    {isAdmin && (
                        <Tooltip title="Dashboard" placement="right">
                            <Link href="/dashboard" className={iconLinkClass('/dashboard')}>
                                <DashboardIcon sx={{ fontSize: 16 }} />
                            </Link>
                        </Tooltip>
                    )}
                </>
            )}
        </div>
    )
}
