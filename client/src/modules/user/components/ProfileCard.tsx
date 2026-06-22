'use client'

import LogoutIcon from '@mui/icons-material/Logout'
import { Avatar, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'

import { authService } from '@modules/auth/services'
import { useUser } from '@modules/user'
import en from '@modules/user/locales/en'

interface IProps {
    isOpen: boolean
}

const t = en.profileCard

export const ProfileCard = ({ isOpen }: IProps) => {
    const router = useRouter();
    const { user } = useUser()

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
        : '?'

    const avatarSx = {
        backgroundColor: '#cfa432',
        color: '#1c140e',
        fontWeight: 700,
        borderRadius: 0,
        border: '2px solid #1c140e',
    }

    return (
        <div className={`border-t-2 border-brand-800 shrink-0 ${isOpen ? 'p-3' : 'p-3 flex justify-center'}`}>
            {isOpen ? (
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar variant="square" sx={{ ...avatarSx, width: 36, height: 36, fontSize: '0.8rem' }}>
                            {initials}
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-gold-300 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <form onSubmit={() => {
                        authService.signOut();
                        router.refresh();
                    }} method="POST">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-3 py-2 border-2 border-transparent uppercase tracking-wider text-sm text-brand-200 hover:border-brand-700 hover:bg-brand-800 hover:text-red-300 transition-colors duration-150"
                        >
                            <LogoutIcon sx={{ fontSize: 16 }} />
                            {t.logOut}
                        </button>
                    </form>
                </div>
            ) : (
                <Tooltip title={user ? `${user.firstName} ${user.lastName}` : ''} placement="right">
                    <Avatar variant="square" sx={{ ...avatarSx, width: 32, height: 32, fontSize: '0.75rem', cursor: 'pointer' }}>
                        {initials}
                    </Avatar>
                </Tooltip>
            )}
        </div>
    )
}
