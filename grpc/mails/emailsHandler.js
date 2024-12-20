import { mailtrapClient, sender } from "../lib/mailTrap.js";
import {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailsTemplates.js";

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

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  commentContent,
  postUrl
) => {
  const recipient = [{ email: recipientEmail }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "New comment on your post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: "Comment_Notification",
    });
    console.log("Email sent successfully", res);
  } catch (error) {
    console.log(error);
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  const recipient = [{ email: senderEmail }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
      category: "Connection_Accepted",
    });
    console.log("Email sent successfully", res);
  } catch (error) {
    console.log(error);
  }
};
