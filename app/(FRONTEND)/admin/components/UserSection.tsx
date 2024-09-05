"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { truncate } from "@/lib/Utils/formatter";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { SignOut } from "@/actions/auth";
import userFromSession from "@/lib/userFromSession";

const UserSection = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const user = userFromSession();

  useEffect(() => {
    setIsClient(true);
  }, []);



  
  // console.log('user',user)

  function getInitials(name: string) {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full py-2">
        {user != null && (
          <div className="flex items-center space-x-4 px-4">
            <Avatar>
              <AvatarFallback>{getInitials(user?.name ?? "NA")}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium leading-none mb-0">
                {user?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-0">
                {truncate(user?.email ?? "", 17)}
              </p>
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/admin/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async (e) => {
            e.preventDefault();
          await  SignOut();
            //  router.push('/Login');
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSection;
