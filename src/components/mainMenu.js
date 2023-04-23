import dynamic from 'next/dynamic'
import Header from '@/components/header'

export default function MainMenu({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
        )
}
