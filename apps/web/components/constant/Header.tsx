"use client";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ChevronDown, Heart, LogOut, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { headerContent } from "@/constants/site";
import TopHeader from "@/components/constant/TopHeader";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { Logo } from "@/components/constant/IconSet";
import CountBadge from "./CountBadge";
import { ThemeSwitch } from "./ThemeSwitch";
import { useUserSelector } from "@/store/features/user/userSelector";
import { logoutUser } from "@/lib/actions/auth";
import { clearUser } from "@/store/features/auth/authSlice";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { useAppDispatch } from "@/hooks/useStore";

function Header({ currentUser }: HeaderProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { cart, wishlist } = useUserSelector();
  const { toast } = useToast();

  const handleLogout = async () => {
    const response = await logoutUser();
    if (response.success) {
      toast({
        title: "Success",
        description: "Logged out successfully.",
      });
      dispatch(clearUser());
    }
  };
  const isRouteActive = (route: string) => pathname.endsWith(route);

  return (
    <header className="flex flex-col gap-5 border-b pb-2">
      <TopHeader />
      <div className="flex-center-between container">
        <Logo />

        <nav className="flex gap-8">
          {headerContent.nav.map(({ label, url, items }) => {
            const isActive = isRouteActive(url);
            return (
              <Link
                href={url}
                key={label}
                className={cn("group/nav-item flex-items-center", {
                  "border-b": isActive,
                })}
              >
                {label}
                {items && <ChevronDown className="size-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex-items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Search />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Link href="/wishlist" className="relative">
            <Heart />
            <CountBadge count={wishlist.length} />
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart />
            <CountBadge count={cart.length} />
          </Link>
          <ThemeSwitch />
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-10 cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>
                    {currentUser?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {headerContent.user.map(({ label, url, Icon }) => {
                    const isActive = isRouteActive(url);

                    return (
                      <DropdownMenuItem key={label} asChild>
                        <Link
                          href={url}
                          className={cn(
                            "flex-items-center cursor-pointer gap-2",
                            {
                              "bg-accent text-accent-foreground": isActive,
                            }
                          )}
                        >
                          <Icon />
                          {label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex-items-center cursor-pointer gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button>
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
