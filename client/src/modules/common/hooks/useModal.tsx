'use client'

import { useCallback, useState } from 'react'

import { IUseModal } from '@modules/common/types/useModal'

export const useModal = (initialOpen = false): IUseModal => {
    const [isOpen, setIsOpen] = useState(initialOpen)

    const showModal = useCallback(() => setIsOpen(true), [])
    const hideModal = useCallback(() => setIsOpen(false), [])

    return { isOpen, showModal, hideModal }
}
