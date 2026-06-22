'use client'

import { useRouter } from 'next/navigation'
import { FC, PropsWithChildren } from 'react'

import { authService } from '@modules/auth/services'

interface IProps {
    className?: string
}

export const SignOutButton: FC<PropsWithChildren<IProps>> = ({ className, children }) => {
    const router = useRouter()

    const handleSignOut = async () => {
        await authService.signOut()
        router.refresh()
    }

    return (
        <button type="button" className={className} onClick={handleSignOut}>
            {children}
        </button>
    )
}

export default SignOutButton
