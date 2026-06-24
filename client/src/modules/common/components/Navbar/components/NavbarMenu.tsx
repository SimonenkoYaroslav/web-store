'use client'

import { Tooltip } from '@mui/material'

import NavLink from '@common/components/NavLink'
import { INavItem } from '@common/types'

interface IProps {
    isOpen: boolean
    items: INavItem[]
}

export const NavbarMenu = ({ isOpen, items }: IProps) => (
    <div className={`flex flex-col gap-1 p-3 flex-1 ${isOpen ? '' : 'items-center'}`}>
        {items.map(({ href, label, icon: Icon }) =>
            isOpen ? (
                <NavLink key={href} href={href}>
                    {label}
                </NavLink>
            ) : (
                <Tooltip key={href} title={label} placement="right">
                    <NavLink href={href} variant="icon">
                        <Icon sx={{ fontSize: 16 }} />
                    </NavLink>
                </Tooltip>
            )
        )}
    </div>
)
