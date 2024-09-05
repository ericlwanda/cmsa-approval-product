import { login } from "@/actions/auth";
import { toast } from "@/components/ui/use-toast";
import { POST } from "@/lib/client/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginDto } from "../(AUTH)/Login/components/LoginCard";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  async function onSubmit(data: LoginDto) {
    setIsLoading(true);
    try {
      await login(data);
      // const res = await POST("/users/auth/login", {});
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error!",
        description: e.message,
      });
    }
  }
  return {
    onSubmit,
    isLoading,
  };
};

export default useAuth;
