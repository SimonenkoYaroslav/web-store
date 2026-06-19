'use client'

import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { IUser } from '@modules/user/types/user'

interface IUserContext {
    user: IUser | null
}

const UserContext = createContext<IUserContext | undefined>(undefined)

type IProps = PropsWithChildren<{
    user: IUser | null
}>

export const UserContextProvider: FC<IProps> = ({ user, children }) => {
    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = (): IUserContext => {
    const context = useContext(UserContext)

    if (context === undefined) {
        throw new Error('useUser must be used within a UserContextProvider')
    }

    return context
}
