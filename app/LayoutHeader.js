'use client'

import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/layout/Navbar'
import styled from 'styled-components'

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 300ms ease-in-out;
`

export default function LayoutHeader() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  // Hide navbar completely on home page
  const isHomePage = pathname === '/'
  if (isHomePage) {
    return null
  }

  // Show navbar on all other pages only if logged in
  if (!user) {
    return null
  }

  return (
    <Header>
      <Navbar />
    </Header>
  )
}
