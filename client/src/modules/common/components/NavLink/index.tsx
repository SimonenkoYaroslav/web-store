'use client'

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';

type NavLinkVariant = 'full' | 'icon';

interface INavLinkProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
    children: ReactNode;
    variant?: NavLinkVariant;
}

const BASE_CLASS = 'flex items-center uppercase tracking-wider transition-colors duration-150';

const VARIANT_CLASS: Record<NavLinkVariant, string> = {
    full: 'px-3 py-2 text-sm font-semibold whitespace-nowrap',
    icon: 'w-8 h-8 justify-center',
};

const INACTIVE_CLASS = 'text-brand-200 border-2 border-transparent hover:bg-brand-800 hover:text-white';

const ACTIVE_CLASS: Record<NavLinkVariant, string> = {
    full: 'bg-gold-400 text-brand-950 font-bold border-2 border-gold-200',
    icon: 'bg-gold-400 text-brand-950 border-2 border-gold-200',
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
