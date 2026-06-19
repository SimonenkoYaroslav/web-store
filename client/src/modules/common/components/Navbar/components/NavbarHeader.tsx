import Link from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

interface IProps {
    isOpen: boolean
    onToggle: () => void
}

export const NavbarHeader = ({ isOpen, onToggle }: IProps) => {
    const icon = isOpen ? <CloseIcon sx={{ fontSize: 18 }} /> : <MenuIcon sx={{ fontSize: 18 }} />
    return (
        <div className={`flex items-center h-14 px-3 border-b border-gray-800 shrink-0 ${isOpen ? 'justify-between' : 'justify-center'}`}>
            {isOpen && (
                <Link href="/catalog" className="font-bold text-white text-sm tracking-widest uppercase whitespace-nowrap">
                    Web Store
                </Link>
            )}
            <button
                onClick={onToggle}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-150"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
                {icon}
            </button>
        </div>
    )
}
