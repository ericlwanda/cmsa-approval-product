"use client";
import React from "react";
import * as Portal from "@radix-ui/react-portal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTobBarStore } from "@/app/(FRONTEND)/hooks/use-top-bar";
import { SideBarMenuList } from "@/routes";
import Link from "next/link";
import { HamburgerIcon } from "@/components/Icons";

const TopBar = () => {
  const { setTopBarRef } = useTobBarStore();

  return (
    <div
      ref={setTopBarRef}
      className="h-navigation-height border-b  justify-between  border-border flex flex-row  w-full items-center"
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-6 md:hidden" asChild>
          <Button variant="ghost" size="icon">
            <HamburgerIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[98vw] mt-4 mx-2">
          {SideBarMenuList.map((link, idx) => (
            <div key={idx} className=" p-3">
              <h1>{link.title}</h1>
              {link.items.map((item, idx) => (
                <DropdownMenuItem
                  asChild
                  className="h-12 cursor-pointer"
                  key={item.label as string}
                >
                  <Link href={item.href as string} passHref>
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const TopBarContainer = ({ children }: { children: React.ReactNode }) => {
  const { topBarRef } = useTobBarStore();

  return (
    <Portal.Root className="w-full" container={topBarRef}>
      {children}
    </Portal.Root>
  );
};

export { TopBarContainer, TopBar };
