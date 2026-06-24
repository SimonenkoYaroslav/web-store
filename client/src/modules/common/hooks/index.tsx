'use client'

import { useCallback, useState } from 'react'

interface IUseModal {
    isOpen: boolean
    showModal: () => void
    hideModal: () => void
}

export const useModal = (initialOpen = false): IUseModal => {
    const [isOpen, setIsOpen] = useState(initialOpen)

    const showModal = useCallback(() => setIsOpen(true), [])
    const hideModal = useCallback(() => setIsOpen(false), [])

    return { isOpen, showModal, hideModal }
}
