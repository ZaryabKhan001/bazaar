import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as SMTPTransport.Options);

transporter.verify((error, success) => {
  if (error) {
    console.log('Email server connection error:', error);
  } else {
    console.log('Server is ready to take messages', success);
  }
});

//? Render an ejs Email Template
export const renderEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    'auth-service',
    'src',
    'utils',
    'email-templates',
    `${templateName}.ejs`,
  );

  if(!fs.existsSync(templatePath)) {
    throw new Error(`Template not found with Name: ${templateName}`);
    
  }

  return ejs.renderFile(templatePath, data);
};

//? Used nodemailer to send an Email
export const sendEmail = async (to: string, subject: string, templateName: string, data: Record<string, any>) => {
  try {
    const html = await renderEmailTemplate(templateName, data);
    await transporter.sendMail({
      from: `<${process.env.SMTP_USER}`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.log('Error Sending Email!', error);
    return false;
  }
};
