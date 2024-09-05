"use server";

import { sendEmail } from "@/lib/mail";

export const emailService = async (data: any) => {
  await sendEmail(data);
};
