// components/layout.js
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/footer'), {
    ssr: false
});

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  )
}