"use client";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export function OrgSidebar() {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" className="translate-y-1 translate-x-2" alt="Logo" height={60} width={60} />
          <span className={cn("font-semibold text-2xl", font.className)}>Scratch!</span>
        </div>
      </Link> 
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            organizationSwitcherTrigger: 'flex items-center space-x-2 bg-white border border-gray-300 rounded-md py-2 px-4 w-full justify-between',
            organizationSwitcherText: 'text-gray-800',
            organizationSwitcherIcon: 'h-5 w-5 text-gray-500',
            organizationSwitcherPopoverCard: 'bg-white border border-gray-200 rounded-md shadow-lg',
            organizationSwitcherPopoverHeader: 'px-4 py-3 bg-gray-100 text-sm font-medium text-gray-600 uppercase tracking-wider',
            organizationSwitcherPopoverList: 'divide-y divide-gray-200',
            organizationSwitcherPopoverItem: 'flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50',
            organizationSwitcherPopoverItemText: 'text-gray-800',
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          variant="ghost"
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Team Boards
          </Link>
        </Button>
        <Button
          variant={favorites ? "secondary" : "ghost"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link
            href={{
              pathname: "/",
              query: {
                favorites: "true",
              },
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Favorite Boards
          </Link>
        </Button>
      </div>
    </div>
  );
}