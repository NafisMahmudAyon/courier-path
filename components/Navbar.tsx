'use client'
import { useAuth } from '@/context/AuthContext'
import { LogIn, Search, User } from 'lucide-react'
import Link from 'next/link'
import { Button, Navbar as Nav, NavbarCollapse, NavbarCollapseBtn, NavbarContainer, NavbarItem, NavbarList } from './aspect-ui'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter()
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  return (
    <div>
      <Nav collapseBreakpoint='md' className="fixed w-full z-50 backdrop-blur-sm bg-bg/80 shadow-sm">
        <NavbarContainer>
          <div className='flex items-center'>
            <h1 className='text-xl font-bold'>
              <Link href="/">
                Courier Path
              </Link>
            </h1>
          </div>
          <NavbarList>
            <NavbarItem>
              <Link
                href="/track"
                className="flex gap-1 items-center"
              >
                <Search className="h-4 w-4" />
                <span>Track Package</span>
              </Link>
            </NavbarItem>
            {user && (<>
              <NavbarItem>
                <Link
                  href="/dashboard"
                  className="flex gap-1 items-center"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
              </NavbarItem>
              <Button onClick={handleLogout} variant='primary'>Logout</Button>
            </>)
            }
            {!user && (<>
              <NavbarItem>
                <Link
                  href="/login"
                  className="flex gap-1 items-center"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="/register"
                  className="flex gap-1 items-center"
                >
                  <User className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </NavbarItem>
            </>)
            }
          </NavbarList>
          <NavbarCollapseBtn />
          <NavbarCollapse className='gap-2'>
            <NavbarItem>
              <Link
                href="/track"
                className="flex gap-1 items-center"
              >
                <Search className="h-4 w-4" />
                <span>Track Package</span>
              </Link>
            </NavbarItem>
            {user && (<>
              <NavbarItem>
                <Link
                  href="/dashboard"
                  className="flex gap-1 items-center"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
              </NavbarItem>
              <Button onClick={handleLogout} variant='primary'>Logout</Button>
            </>)
            }
            {!user && (<>
              <NavbarItem>
                <Link
                  href="/login"
                  className="flex gap-1 items-center"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  href="/register"
                  className="flex gap-1 items-center"
                >
                  <User className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </NavbarItem>
            </>)
            }
          </NavbarCollapse>
        </NavbarContainer>
      </Nav>
    </div>
  )
}

export default Navbar