'use client'

import LogoutIcon from '@mui/icons-material/Logout'
import { Avatar, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'

import { authService } from '@modules/auth/services'
import { useUser } from '@modules/user'

interface IProps {
    isOpen: boolean
}

export const ProfileCard = ({ isOpen }: IProps) => {
    const router = useRouter();
    const { user } = useUser()

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
        : '?'

    const avatarSx = { bgcolor: '#4f46e5', fontWeight: 600 }

    return (
        <div className={`border-t border-gray-800 shrink-0 ${isOpen ? 'p-3' : 'p-3 flex justify-center'}`}>
            {isOpen ? (
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar sx={{ ...avatarSx, width: 36, height: 36, fontSize: '0.8rem' }}>
                            {initials}
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <form onSubmit={() => {
                        authService.signOut();
                        router.refresh();
                    }} method="POST">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors duration-150"
                        >
                            <LogoutIcon sx={{ fontSize: 16 }} />
                            Log out
                        </button>
                    </form>
                </div>
            ) : (
                <Tooltip title={user ? `${user.firstName} ${user.lastName}` : ''} placement="right">
                    <Avatar sx={{ ...avatarSx, width: 32, height: 32, fontSize: '0.75rem', cursor: 'pointer' }}>
                        {initials}
                    </Avatar>
                </Tooltip>
            )}
        </div>
    )
}
