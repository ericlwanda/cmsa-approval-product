"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomIcon } from "@/components/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export interface ISideMenuGroup {
  title?: string;
  items: ISideMenuItem[];
}

export interface ISideMenuItem {
  label: string;
  icon?: any;
  href: string;
  permitted: string[];
}

const SideMenuGroups = ({ title, items }: ISideMenuGroup) => {
  const path = usePathname();
  const { data: session } = useSession();
  //@ts-ignore
  const user = session?.user?.userInfo;

  useEffect(() => {
    if (user == null) {
      window.location.reload();
    }
  }, []);

  // Filter items based on the user's role
  const permittedItems = items.filter((item) => user && item.permitted.includes(user.role));

  // If no items are permitted, don't render the group
  if (permittedItems.length === 0) return null;

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 tracking-tight">{title}</h2>
      {user && (
        <div className="space-y-1">
          {permittedItems.map((item, idx) => (
            <Link key={idx} href={`${item.href}`}>
              <Button
                key={idx}
                variant={path === item.href ? "secondary" : "ghost"}
                className="w-full mt-2 py-5 justify-start"
              >
                <CustomIcon icon={item.icon} />
                <div className="text-muted-foreground ml-5 text-sm font-normal">
                  {item.label}
                </div>
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideMenuGroups;
