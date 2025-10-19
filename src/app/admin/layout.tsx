
"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  HardDrive,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser } from "@/firebase";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();


  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/admin/login' && pathname !== '/admin/signup') {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading && pathname !== '/admin/login' && pathname !== '/admin/signup') {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }
  
  if (!user && pathname !== '/admin/login' && pathname !== '/admin/signup') {
    return null; // Don't render layout for non-authed users outside of login/signup
  }

  // Hide sidebar and header for login/signup pages
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return <>{children}</>;
  }


  const getPageTitle = () => {
    if (pathname.startsWith('/admin/products/add')) return 'Add Product';
    const currentItem = adminNavItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/'));
    return currentItem ? currentItem.label : 'Dashboard';
  }
  
  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <HardDrive className="h-6 w-6 text-primary" />
                </Link>
            </Button>
            <div className="flex flex-col text-left">
              <span className="text-lg font-bold font-headline">TechNova</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
              <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ''} alt="user avatar" />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="text-sm font-semibold truncate">{user?.displayName || user?.email}</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
               <Button variant="ghost" size="icon" onClick={handleSignOut} className="ml-auto">
                  <LogOut className="h-5 w-5"/>
               </Button>
            </div>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            <span>Back to Store</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="p-4 border-b flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold font-headline">{getPageTitle()}</h1>
        </header>
        <div className="p-4 md:p-6 bg-background">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
