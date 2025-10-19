"use client";

import Link from "next/link";
import { HardDrive, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser, useAuth } from "@/firebase";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignOut = async () => {
    await auth.signOut();
    closeMobileMenu();
  };


  const NavLinks = ({ isMobile }: { isMobile?: boolean }) => (
    <nav className={cn(
      "flex items-center gap-4", 
      isMobile ? "flex-col space-y-4 pt-8 text-lg" : "hidden md:flex"
    )}>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={isMobile ? closeMobileMenu : undefined}
          className={cn(
            "font-medium transition-colors hover:text-primary",
            pathname === href ? "text-primary" : "text-foreground/80"
          )}
        >
          {label}
        </Link>
      ))}
      {!isUserLoading && user && pathname.startsWith('/admin') ? (
         <Button variant={isMobile ? "default" : "ghost"} onClick={handleSignOut}>
           <LogOut className={cn(!isMobile && "mr-2")}/> {isMobile ? 'Sign Out' : ''}
         </Button>
      ) : (
         <Link
            href="/admin/login"
            onClick={isMobile ? closeMobileMenu : undefined}
            className={cn(
              "font-medium transition-colors hover:text-primary",
              pathname === "/admin/login" ? "text-primary" : "text-foreground/80"
            )}
          >
           Admin
          </Link>
      )}
    </nav>
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "border-b bg-background/95 backdrop-blur" : "bg-background"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <HardDrive className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">
            TechNova
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-background">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b pb-4">
                     <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                        <HardDrive className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold font-headline text-foreground">
                          TechNova
                        </span>
                      </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetTrigger>
                  </div>
                  <div className="flex-grow pt-8">
                    <NavLinks isMobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
