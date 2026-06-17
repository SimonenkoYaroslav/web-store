'use client'

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';

type NavLinkVariant = 'full' | 'icon';

interface INavLinkProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
    children: ReactNode;
    variant?: NavLinkVariant;
}

const BASE_CLASS = 'flex items-center rounded-lg transition-colors duration-150';

const VARIANT_CLASS: Record<NavLinkVariant, string> = {
    full: 'px-3 py-2 text-sm font-medium whitespace-nowrap',
    icon: 'w-8 h-8 justify-center',
};

const INACTIVE_CLASS = 'text-gray-400 hover:bg-gray-700 hover:text-white';

const ACTIVE_CLASS: Record<NavLinkVariant, string> = {
    full: 'bg-indigo-600 text-white shadow-sm',
    icon: 'bg-indigo-600 text-white',
};

/**
 * Sidebar navigation link with active-route styling.
 *
 * Centralises the active/inactive class logic the Navbar previously declared
 * inline as `linkClass` / `iconLinkClass`. Forwards its ref and spreads extra
 * props so it can be used directly as an MUI Tooltip child.
 */
const NavLink = forwardRef<HTMLAnchorElement, INavLinkProps>(
    ({ href, children, variant = 'full', ...rest }, ref) => {
        const pathname = usePathname();
        const isActive = pathname.startsWith(String(href));
        const stateClass = isActive ? ACTIVE_CLASS[variant] : INACTIVE_CLASS;

        return (
            <Link
                {...rest}
                ref={ref}
                href={href}
                className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${stateClass}`}
            >
                {children}
            </Link>
        );
    }
);

NavLink.displayName = 'NavLink';

export default NavLink;
