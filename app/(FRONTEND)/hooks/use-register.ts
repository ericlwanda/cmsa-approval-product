import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteCookie, setCookie } from "cookies-next";
import { AxiosResponse } from "axios";

import { IRegisterResponse } from "@/types/user";
import { POST } from "@/lib/client/client";

const UseRegister = () => {
  const router = useRouter();

  const {
    mutate: registerUser,
    error: errorObj,
    isError,
    isPending,
  } = useMutation({
    mutationFn: (v: { name:string;email: string; phone_number:string,password: string;confirmPassword:string }) =>
      POST("/auth/register", v) as Promise<AxiosResponse<IRegisterResponse>>,
    onSuccess: (response) => {
      router.push("/Login");
    },
  });

  const error = errorObj as any;
  return { registerUser, isPending, error, isError };
};

export default UseRegister;
