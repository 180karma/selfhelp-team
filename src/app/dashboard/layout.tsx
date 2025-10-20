
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  BookOpenText,
  Users,
  Crown,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Menu,
  X,
  HeartHandshake,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { cn } from '@/lib/utils';

function UserAvatar() {
  const { user } = useUser();
  return (
    <Avatar>
      <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user-avatar/40/40"} />
      <AvatarFallback>{user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
    </Avatar>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      // If closing, trigger animation first
      setIsClosing(true);
      setTimeout(() => {
        setMobileMenuOpen(false);
        setIsClosing(false);
      }, 300); // Match animation duration
    } else {
      setMobileMenuOpen(true);
    }
  };

  const closeMobileMenu = () => {
    setIsClosing(true);
    // Small delay to show click feedback before closing
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 200); // Slightly faster for navigation
  };

  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        {/* Mobile Pull-Down Menu */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50">
          {/* Tab Handle */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "w-full bg-gradient-to-r from-sky-600 to-blue-700 text-white py-3 px-4 flex items-center justify-between shadow-lg transition-all duration-300 active:scale-[0.98]",
              mobileMenuOpen ? "rounded-b-none" : "rounded-b-lg"
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 text-white" />
              <span className="font-headline text-base font-semibold">ThriveWell</span>
            </div>
            {mobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>

          {/* Dropdown Menu Content */}
          <div
            className={cn(
              "relative bg-background border-b shadow-xl overflow-hidden z-50 transition-all duration-300",
              mobileMenuOpen && !isClosing ? "max-h-[80vh] animate-slide-down" : isClosing ? "max-h-0 animate-slide-up" : "max-h-0"
            )}
          >
            {mobileMenuOpen && (
              <div className="p-4 space-y-2">
                <Link href="/dashboard" onClick={closeMobileMenu}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 opacity-0 animate-menu-item menu-item-1",
                    "active:scale-95 active:bg-primary/20",
                    isActive('/dashboard') ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:scale-[1.02]"
                  )}>
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </div>
                </Link>
                
                <Link href="/dashboard/diary" onClick={closeMobileMenu}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 opacity-0 animate-menu-item menu-item-2",
                    "active:scale-95 active:bg-primary/20",
                    pathname.startsWith('/dashboard/diary') ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:scale-[1.02]"
                  )}>
                    <BookOpenText className="w-5 h-5" />
                    <span className="font-medium">Diary</span>
                  </div>
                </Link>

                <Link href="/dashboard/mantras" onClick={closeMobileMenu}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 opacity-0 animate-menu-item menu-item-3",
                    "active:scale-95 active:bg-primary/20",
                    isActive('/dashboard/mantras') ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:scale-[1.02]"
                  )}>
                    <HeartHandshake className="w-5 h-5" />
                    <span className="font-medium">Mantras</span>
                  </div>
                </Link>
                
                <Link href="/dashboard/profile" onClick={closeMobileMenu}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 opacity-0 animate-menu-item menu-item-4",
                    "active:scale-95 active:bg-primary/20",
                    isActive('/dashboard/profile') ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:scale-[1.02]"
                  )}>
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </div>
                </Link>
                
                <Link href="/dashboard/agents" onClick={closeMobileMenu}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 opacity-0 animate-menu-item menu-item-5",
                    "active:scale-95 active:bg-primary/20",
                    pathname.startsWith('/dashboard/agents') ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:scale-[1.02]"
                  )}>
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Wellness Team</span>
                  </div>
                </Link>
                
                <Link href="/dashboard/subscription" onClick={closeMobileMenu}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 opacity-0 animate-menu-item menu-item-6",
                    "active:scale-95 active:bg-primary/20",
                    isActive('/dashboard/subscription') ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:scale-[1.02]"
                  )}>
                    <Crown className="w-5 h-5" />
                    <span className="font-medium">Subscription</span>
                  </div>
                </Link>

                <div className="border-t pt-2 mt-2">
                  <Link href="/dashboard/settings" onClick={closeMobileMenu}>
                    <div className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 opacity-0 animate-menu-item menu-item-7",
                      "active:scale-95 active:bg-primary/20",
                      isActive('/dashboard/settings') ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:scale-[1.02]"
                    )}>
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </div>
                  </Link>
                  
                  <Link href="/" onClick={closeMobileMenu}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-95 active:bg-destructive/20 opacity-0 animate-menu-item menu-item-8">
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Log Out</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay when menu is open */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/20 z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="w-7 h-7 text-primary" />
              <span className="font-headline text-xl font-semibold">ThriveWell</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" passHref>
                  <SidebarMenuButton
                    isActive={isActive('/dashboard')}
                    icon={<LayoutDashboard />}
                    tooltip="Dashboard"
                  >
                    Dashboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/diary" passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith('/dashboard/diary')}
                    icon={<BookOpenText />}
                    tooltip="Diary"
                  >
                    Diary
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/mantras" passHref>
                  <SidebarMenuButton
                    isActive={isActive('/dashboard/mantras')}
                    icon={<HeartHandshake />}
                    tooltip="Mantras"
                  >
                    Mantras
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/profile" passHref>
                  <SidebarMenuButton
                    isActive={isActive('/dashboard/profile')}
                    icon={<User />}
                    tooltip="Profile"
                  >
                    Profile
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/agents" passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith('/dashboard/agents')}
                    icon={<Users />}
                    tooltip="Wellness Team"
                  >
                    Wellness Team
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/subscription" passHref>
                  <SidebarMenuButton
                    isActive={isActive('/dashboard/subscription')}
                    icon={<Crown />}
                    tooltip="Subscription"
                  >
                    Subscription
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                <Link href="/dashboard/settings" passHref>
                  <SidebarMenuButton 
                    isActive={isActive('/dashboard/settings')}
                    icon={<Settings />} 
                    tooltip="Settings"
                  >
                    Settings
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/" passHref>
                  <SidebarMenuButton icon={<LogOut />} tooltip="Log Out">
                    Log Out
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Desktop Header */}
            <header className="sticky top-0 z-30 hidden md:flex h-14 items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-4 lg:h-[60px] lg:px-6">
              <SidebarTrigger className="md:hidden flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {/* Can add page title here */}
              </div>
              <div className="flex-shrink-0">
                <UserAvatar />
              </div>
            </header>

            {/* Mobile Header with Avatar */}
            <header className="sticky top-[52px] md:top-0 z-40 flex md:hidden h-14 items-center justify-end gap-2 border-b bg-background px-4">
              <UserAvatar />
            </header>
            
            <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
                {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
