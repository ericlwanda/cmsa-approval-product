import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginInputDto } from "@/types/auth";
import { POST } from "./lib/client/client";


export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validateFields = LoginInputDto.safeParse(credentials);
        if (validateFields.success) {
          const res = await POST("/auth/login", validateFields.data);
          if (res.status == 200) {
            return res.data;
          }
          return null;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
