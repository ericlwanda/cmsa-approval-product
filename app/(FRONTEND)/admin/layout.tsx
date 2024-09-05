import { Inter } from "next/font/google";
import { TopBar } from "./components/TopBar";
import SideBar from "./components/SideBar";
import { ThemeSwitcher } from "@/components/Theme-switcher";
import { ThemeWrapper } from "@/components/ThemeWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className=" md:block">
      <div className="border-t">
        <div className="bg-background">
          <div className="flex  flex-row">
            <SideBar />
            <div className=" flex flex-1 h-full md:h-screen flex-col lg:border-l ">
              <TopBar />
              <div className=" flex flex-col  overflow-y-scroll   flex-1  ">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
