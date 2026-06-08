'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import {
  LayoutDashboard,
  CheckSquare,
  CreditCard,
  Sliders,
  Menu,
  X,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Campaigns',
    href: '/admin/campaigns',
    icon: <CheckSquare size={20} />,
  },
  {
    label: 'Transactions',
    href: '/admin/transactions',
    icon: <CreditCard size={20} />,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <Sliders size={20} />,
  },
]

// Styled Components
const DesktopSidebar = styled.aside<{ $isOpen: boolean }>`
  display: none;
  width: ${(props) => (props.$isOpen ? '16rem' : '5rem')};
  flex-direction: column;
  gap: 1rem;
  border-right: 1px solid #e5e7eb;
  background-color: #ffffff;
  transition: all 0.3s ease;
  position: sticky;
  top: 4rem;
  height: calc(100vh - 4rem);
  padding: 0;

  @media (min-width: 768px) {
    display: flex;
  }
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`

const SidebarTitle = styled.span<{ $isOpen: boolean }>`
  font-weight: 700;
  color: #6366f1;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
`

const ToggleButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  color: #111827;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }

  &:focus {
    outline: none;
  }
`

const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.5rem;
`

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? '#6366f1' : '#6b7280')};
  background-color: ${(props) => (props.$isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent')};
  font-weight: ${(props) => (props.$isActive ? 500 : 400)};

  &:hover {
    background-color: ${(props) => (props.$isActive ? 'rgba(99, 102, 241, 0.1)' : '#f3f4f6')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }
`

const NavLabel = styled.span<{ $isOpen: boolean }>`
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  white-space: nowrap;
`

const SidebarFooter = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
`

const FooterText = styled.p<{ $isOpen: boolean }>`
  font-size: 0.75rem;
  color: #6b7280;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
`

const MobileToggleContainer = styled.div`
  display: flex;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 40;

  @media (min-width: 768px) {
    display: none;
  }
`

const MobileToggleButton = styled.button`
  padding: 0.75rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(99, 102, 241, 0.9);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #6366f1;
  }
`

const MobileOverlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  top: 4rem;
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.5);

  @media (max-width: 767px) {
    display: block;
  }
`

const MobileSidebar = styled.aside`
  width: 16rem;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const MobileNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.5rem;
  padding-top: 1rem;
`

const MobileNavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? '#6366f1' : '#6b7280')};
  background-color: ${(props) => (props.$isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent')};
  font-weight: ${(props) => (props.$isActive ? 500 : 400)};

  &:hover {
    background-color: ${(props) => (props.$isActive ? 'rgba(99, 102, 241, 0.1)' : '#f3f4f6')};
  }
`

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar $isOpen={isOpen}>
        {/* Toggle Button */}
        <SidebarHeader>
          <SidebarTitle $isOpen={isOpen}>Admin</SidebarTitle>
          <ToggleButton
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </ToggleButton>
        </SidebarHeader>

        {/* Navigation Items */}
        <SidebarNav>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <NavLink
                key={item.href}
                href={item.href}
                $isActive={isActive}
                title={item.label}
              >
                {item.icon}
                <NavLabel $isOpen={isOpen}>{item.label}</NavLabel>
              </NavLink>
            )
          })}
        </SidebarNav>

        {/* Footer */}
        <SidebarFooter>
          <FooterText $isOpen={isOpen}>Admin Panel v1.0</FooterText>
        </SidebarFooter>
      </DesktopSidebar>

      {/* Mobile Sidebar Toggle Button */}
      <MobileToggleContainer>
        <MobileToggleButton
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileToggleButton>
      </MobileToggleContainer>

      {/* Mobile Sidebar */}
      {isOpen && (
        <MobileOverlay>
          <MobileSidebar>
            {/* Navigation Items */}
            <MobileNav>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <MobileNavLink
                    key={item.href}
                    href={item.href}
                    $isActive={isActive}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </MobileNavLink>
                )
              })}
            </MobileNav>
          </MobileSidebar>
        </MobileOverlay>
      )}
    </>
  )
}
