import { Request, Response } from 'express';
import { google } from 'googleapis';
import { prisma } from '../config/database';
import { config } from '../config/environment';
import { generateTokenResponse } from '../utils/jwt';
import { hashPassword, generateTempPassword } from '../utils/bcrypt';

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_CALLBACK_URL
);

export const googleAuthRedirect = (req: Request, res: Response): void => {
  const authUrl = oauth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    access_type: 'offline',
    prompt: 'consent'
  });

  res.redirect(authUrl);
};

export const googleAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Código de autorización inválido' });
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      res.status(400).json({ error: 'No se pudo obtener el email de Google' });
      return;
    }

    let user = await prisma.usuario.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (!user) {
      const tempPass = generateTempPassword();
      const hashedPassword = await hashPassword(tempPass);

      const nombre = data.given_name || (data.name ? data.name.split(' ')[0] : '');
      const apellido =
        data.family_name || (data.name ? data.name.split(' ').slice(1).join(' ') : '');

      user = await prisma.usuario.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          nombre,
          apellido,
          emailVerificado: true,
          activo: true
        }
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      verificado: user.emailVerificado
    } as const;

    const tokenResponse = generateTokenResponse(payload);

    const frontendURL = config.FRONTEND_URL || 'http://localhost:3000';
    const redirectURL = `${frontendURL}/auth/callback?token=${tokenResponse.token}`;

    res.redirect(redirectURL);
  } catch (error) {
    console.error('❌ Error en autenticación con Google:', error);
    res.status(500).json({
      error: 'Error en autenticación con Google',
      message: 'Ocurrió un error al procesar la autenticación'
    });
  }
};