import { useSession } from "next-auth/react";



const userFromSession = () => {
  const session = useSession();
  //@ts-ignore
  const user = session.data?.user?.userInfo
  return user;
};


export default userFromSession;



