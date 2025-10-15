'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider, useUser } from '@/firebase';

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

  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        <Sidebar>
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
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* Can add page title here */}
            </div>
            <UserAvatar />
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}
