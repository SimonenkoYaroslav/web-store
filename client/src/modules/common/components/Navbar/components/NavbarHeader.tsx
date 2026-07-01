'use client'

import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface IProps {
    isOpen: boolean
    onToggle: () => void
}

export const NavbarHeader = ({ isOpen, onToggle }: IProps) => {
    const t = useTranslations('navbarHeader')
    const icon = isOpen ? <CloseIcon sx={{ fontSize: 18 }} /> : <MenuIcon sx={{ fontSize: 18 }} />

    return (
        <div className={`flex items-center h-14 px-3 border-b-2 border-brand-800 shrink-0 ${isOpen ? 'justify-between' : 'justify-center'}`}>
            {isOpen && (
                <Link href="/" className="font-serif font-bold text-base tracking-widest uppercase whitespace-nowrap text-gold-300">
                    {t('brandName')}
                </Link>
            )}
            <button
                onClick={onToggle}
                className="w-8 h-8 flex items-center justify-center border-2 border-transparent text-brand-200 hover:text-white hover:border-brand-700 hover:bg-brand-800 transition-colors duration-150"
                aria-label={isOpen ? t('closeMenu') : t('openMenu')}
            >
                {icon}
            </button>
        </div>
    )
}
