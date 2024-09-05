"use client";
import React, { useEffect, useState } from "react";
import SideMenuGroups, { ISideMenuGroup } from "./SideMenuGroups";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { SideBarMenuList } from "@/routes";
import UserSection from "./UserSection";

interface ISideBarProps extends React.HTMLAttributes<HTMLDivElement> {}
const SideBar = (props: ISideBarProps) => {
  const { setTheme } = useTheme();
  const [show, setShow] = useState<boolean>(false);
  const [isClient, setClient] = useState<boolean>(false);

  useEffect(() => {
    setShow(true);
    setClient(true);
  }, []);

  return (
    <div className=" hidden lg:flex w-60 h-screen flex-col">
      <div className="px-7 flex flex-row justify-between h-navigation-height items-center gap-2 border-b min-h-max py-4">
        <div className=" flex flex-row items-center gap-4">
          {/* <Logo className=" h-[1.5rem] w-[1.5rem]" /> */}
          <Image src="/CMSA.png" width={50} height={50} alt="CMSA" />
          <div className="flex flex-col items-center ">
          
            <span>E-LICENSE</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[0.4rem] w-[0.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[0.1rem] w-[0.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {show && (
        <>
          {!isClient ? null : (
            <div className="overflow-scroll">
              {SideBarMenuList.map((menuGroup, idx) => (
                <SideMenuGroups
                  key={idx}
                  title={menuGroup.title}
                  items={menuGroup.items}
                />
              ))}
            </div>
          )}
       
     

      <div className=" mt-auto border-t">
        <UserSection />
      </div>
      </>
       )}
    </div>
  );
};

export default SideBar;
