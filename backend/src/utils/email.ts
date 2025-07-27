import nodemailer from 'nodemailer';
import { config } from '../config/environment';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: Number(config.SMTP_PORT) === 465,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (to: string, nombre: string) => {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    console.warn('SMTP configuration missing, skipping email sending');
    return;
  }
  try {
    await transporter.sendMail({
      from: `MotoMar <${config.SMTP_USER}>`,
      to,
      subject: 'Bienvenido a MotoMar',
      text: `Hola ${nombre}, tu cuenta ha sido creada con \u00E9xito. Bienvenido a MotoMar!`,
      html: `<p>Hola <b>${nombre}</b>, tu cuenta ha sido creada con éxito.</p><p>Bienvenido a MotoMar!</p>`,
    });
    console.log(`\u2709\uFE0F Email de bienvenida enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error);
  }
};