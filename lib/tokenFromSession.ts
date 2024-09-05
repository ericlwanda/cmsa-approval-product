import { useSession } from "next-auth/react";

export const tokenFromSession = () => {
    const session = useSession();
    //@ts-ignore
    const token = session?.data?.sessionToken;
    return token;
  };