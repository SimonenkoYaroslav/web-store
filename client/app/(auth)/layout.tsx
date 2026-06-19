import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { userService } from '@modules/user/services'

export default async function AuthLayout({ children }: PropsWithChildren) {
    const user = await userService.fetchCurrentUser()

    if (user) {
        redirect('/catalog')
    }

    return children
}
