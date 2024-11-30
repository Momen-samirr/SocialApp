import { mailtrapClient, sender } from "../lib/mailTrap.js";
import { createWelcomeEmailTemplate } from "./emailsTemplates.js";

export const sendWelcomeEmail = async (name, email, profileUrl) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Social App",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "Welcome Email",
    });
    console.log("Email sent successfully", res);
  } catch (error) {
    console.log(error);
  }
};
