'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tooltip } from '@mui/material'
import { INavItem } from '@common/types'

interface IProps {
    isOpen: boolean
    items: INavItem[]
}

export const NavbarMenu = ({ isOpen, items }: IProps) => {
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
            {items.map(({ href, label, icon: Icon }) =>
                isOpen ? (
                    <Link key={href} href={href} className={linkClass(href)}>
                        {label}
                    </Link>
                ) : (
                    <Tooltip key={href} title={label} placement="right">
                        <Link href={href} className={iconLinkClass(href)}>
                            <Icon sx={{ fontSize: 16 }} />
                        </Link>
                    </Tooltip>
                )
            )}
        </div>
    )
}
