"use server"
import nodemailer from 'nodemailer';
import { NextApiResponse } from "next";
import { NextRequest } from 'next/server';

const myEmail = "tomyfletcher99@hotmail.com";

export const GET = async (req: NextRequest) => {
  console.log("Access to nodemailer API GET");
  return new Response(JSON.stringify({ message: "GET request received" }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const POST = async (req: NextRequest) => {
  try {
    console.log("Access to nodemailer API POST");
    const { email, name, message } = await req.json();

    if (!email || !name || !message) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const emailContent = `
      <div>
        <p>${message}</p>
        <br>
        <p>You can get back to me at the following address: ${email}</p>
      </div>
    `;

    // Setup transporter for Hotmail
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',  // Correct SMTP server for Hotmail
      port: 587,                     // Port for sending mail (587 is for STARTTLS)
      secure: false,                 // false for TLS, true for SSL
      auth: {
        user: myEmail,               // Your Hotmail email address
        pass: "",   // Use your app password here
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });

    // Send the email
    await transporter.sendMail({
      from: myEmail,
      to: myEmail,
      subject: `Greetings from ${name}`,
      html: emailContent,
    });

    return new Response(JSON.stringify({ message: "Successfully sent email. Thanks for contacting me! I will get back to you ASAP :)" }), { status: 201 });

  } catch (error) {
    console.error("Error sending mail:", error);
    return new Response(JSON.stringify({ message: "Error sending email. Please try again." }), { status: 500 });
  }
};