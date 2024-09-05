"use server";

import { LoginDto } from "@/app/(FRONTEND)/(AUTH)/Login/components/LoginCard";
import { signIn, signOut } from "@/auth";
import { LoginInputDto } from "@/types/auth";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: LoginDto) => {
  const validateFields = LoginInputDto.safeParse(values);
  if (!validateFields.success) {
    throw "Invalid fields";
  }
  const { username, password } = validateFields.data;

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.log("error login", error);
          return { error: "Invalid Credentials" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
  return { message: "Logged in successfully" };
};

export const SignOut = async () => {
  await signOut();

};
