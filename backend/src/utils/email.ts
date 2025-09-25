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

export const sendLoginEmail = async (to: string, nombre: string) => {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    console.warn('SMTP configuration missing, skipping email sending');
    return;
  }
  try {
    const loginTime = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
    });
    await transporter.sendMail({
      from: `MotoMar <${config.SMTP_USER}>`,
      to,
      subject: 'Nuevo inicio de sesión',
      text: `Hola ${nombre}, has iniciado sesión en MotoMar el ${loginTime}. Si no fuiste tú, cambia tu contraseña de inmediato.`,
      html: `<p>Hola <b>${nombre}</b>, has iniciado sesión en MotoMar el ${loginTime}.</p><p>Si no fuiste tú, <a href="${config.FRONTEND_URL}/auth/reset-password">cambia tu contraseña</a> de inmediato.</p>`,
    });
    console.log(`\u2709\uFE0F Email de login enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error enviando email de login:', error);
  }

};