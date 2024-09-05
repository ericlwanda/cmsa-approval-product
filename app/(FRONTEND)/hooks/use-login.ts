// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { deleteCookie, setCookie } from "cookies-next";
// import { AxiosResponse } from "axios";
// import { AUTH, POST } from "@/lib/client/client";
// import { ILoginResponse } from "@/types/user";

// const UseLogin = () => {
//   const router = useRouter();

//   const {
//     mutate: login,
//     error: errorObj,
//     isError,
//     isPending,
//   } = useMutation({
//     mutationFn: (v: { username: string; password: string }) =>
//       AUTH("/auth/login", v) as Promise<AxiosResponse<ILoginResponse>>,
//     onSuccess: (response) => {
//       setCookie("user", response.data.userInfo);
//       setCookie("accessToken", response.data.AccessToken);
//       localStorage.setItem("token", response.data.AccessToken);
//       router.push("/admin");
//     },
//   });


//   const error = errorObj as any;
//   return { login, isPending, error, isError};
// };

// export default UseLogin;
