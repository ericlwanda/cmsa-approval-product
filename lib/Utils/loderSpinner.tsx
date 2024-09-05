import { Icons } from "@/components/Icons";

export  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
       
        <p className="mt-4 text-gray-600">  <Icons.spinner className="h-20 w-20 animate-spin" />Loading... Please wait!</p>
      </div>
      
    </div>
  );