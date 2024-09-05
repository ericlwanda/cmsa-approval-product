import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

        <div className="container relative hidden h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0  bg-primary" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Image src="/CMSA.png" width={100} height={100} alt="CMSA" />
              E-LICENSING APPROVAL OF PRODUCT
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;This is a portal used by to Apply for License from
                  Capital Market Security Authority&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">{children}</div>
        </div>

  );
}
