// import { getSession } from "next-auth/react";

// export const RoleCheck = async (roles: string[]): Promise<boolean> => {
//   // Retrieve the session
//   const session = await getSession();
  
//   // Log session data for debugging
//   console.log('User Session:', session);
  
//   // Check if the user role exists in the session
//   // const userRole = session?.data?.user?.userInfo?.role; // Adjust based on your session structure

//   // If no role or user is invalid, return false
//   if (!userRole) return false;

//   // Check if user's role is in the allowed roles
//   return roles.includes(userRole);
// };
