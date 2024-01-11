"use server"
import nodemailer from 'nodemailer';
import { NextApiResponse } from "next";

const myEmail = "tomyfletcher99@hotmail.com"

export const POST = async (req: any, res: NextApiResponse) => {
  const { email, name, message } = await req.json();

  const emailContent = `
    <div>
      <p>${message}</p>
      <br>
      <p>You can get back to me at the following address: ${email}</p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
      user: 'tomyfletcher99@hotmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1,
  });

  const sendEmail = async (emailContent: any, userEmail: string) => {
    const mailOptions = {
      from: myEmail,
      to: myEmail,
      html: emailContent,
      subject: `Greetings from ${name}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info);
    } catch (error) {
      console.error('Error sending mail: ', error);
      throw new Error("Mail Failed to Send");
    }
  };

  try {
    await sendEmail(emailContent, myEmail);
    return new Response(JSON.stringify({ message: "Successfully sent email. Thanks for contacting me! I will get back to you ASAP :)" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error sending email. Please try again and ensure your email is correct" }), { status: 501 });
  }
};

