import { IBookingForm } from "@/app/(WEBSITE)/components/BookForm";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: IBookingForm) => {
  const {
    email,
    name,
    phone,
    employment,
    car,
    duration,
    movement,
    idType,
    id,
    description,
  } = data;
  const htmlTemplate = `
    <div>
      <p>New order created:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Employment:</strong> ${employment}</li>
        <li><strong>Car:</strong> ${car}</li>
        <li><strong>Duration:</strong> ${duration}</li>
        <li><strong>Movement:</strong> ${movement}</li>
        <li><strong>ID Type:</strong> ${idType}</li>
        <li><strong>ID:</strong> ${id}</li>
        ${
          description
            ? `<li><strong>Description:</strong> ${description}</li>`
            : ""
        }
      </ul>
    </div>`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "rodneypaul35@gmail.com",
    subject: "New Order",
    html: htmlTemplate,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "rodneypaul35@gmail.com",
    subject: "Reset your password",
    html: ` <p> Hello "${name}"
    Click <a href="${resetLink}"> here</a> to reset password
  </p>`,
  });
};
