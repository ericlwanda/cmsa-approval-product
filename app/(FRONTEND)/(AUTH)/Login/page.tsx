"use client";
import React, { useEffect } from "react";
import LoginForm from "./components/LoginCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const page = () => {
  const path = usePathname();
  useEffect(() => {
    if (path != "/Login") {
      window.location.reload();
    }
  }, []);

  return (
    <div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and Password below to login
            </p>
          </div>
          <LoginForm />
          <Link
            href="/Register"
            className={cn(
              buttonVariants({ variant: "default" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            Register
          </Link>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
