import { Navbar } from '@common/components'

interface IProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: IProps) {
    return (
        <div className="flex flex-row min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
        </div>
    )
}
