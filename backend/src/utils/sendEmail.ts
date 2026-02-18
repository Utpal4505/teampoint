import nodemailer from 'nodemailer'
import { env } from '../config/env.ts'

type SendEmailInput = {
  to: string
  subject: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  auth: {
    user: env.BREVO_SMTP_USER,
    pass: env.BREVO_SMTP_PASS,
  },
})

export const sendEmail = async (input: SendEmailInput) => {
  const { to, subject, html } = input

  const mailOptions = {
    from: `"Teampoint" <${env.BREVO_SMTP_USER}>`,
    to,
    subject,
    html,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`)
  }
}
