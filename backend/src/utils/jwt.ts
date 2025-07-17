 // src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

// Interfaces para tipado
export interface JWTPayload {
  userId: string;
  email: string;
  nombre: string;
  apellido: string;
  verificado: boolean;
}

export interface TokenResponse {
  token: string;
  expiresIn: string;
  user: JWTPayload;
}

// Generar token JWT
export const generateToken = (payload: JWTPayload): string => {
  try {
    // Crear string simple del payload
    const payloadString = JSON.stringify({
      userId: payload.userId,
      email: payload.email,
      nombre: payload.nombre,
      apellido: payload.apellido,
      verificado: payload.verificado,
      iat: Math.floor(Date.now() / 1000)
    });
    
    // Usar solo los parámetros básicos que funcionan
    return jwt.sign(
      { data: payloadString }, 
      String(config.JWT_SECRET)
    );
  } catch (error) {
    console.error('❌ Error generando token JWT:', error);
    throw new Error('Error generando token de autenticación');
  }
};
// Verificar token JWT
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, String(config.JWT_SECRET)) as any;
    const data = JSON.parse(decoded.data);
    
    return {
      userId: data.userId,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      verificado: data.verificado
    };
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    throw new Error('Token inválido');
  }
};
// Extraer token del header Authorization
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }
  
  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

// Generar response completo con token
export const generateTokenResponse = (payload: JWTPayload): TokenResponse => {
  const token = generateToken(payload);
  
  return {
    token,
    expiresIn: config.JWT_EXPIRES_IN,
    user: payload
  };
};

// Refresh token (para futuras implementaciones)
export const refreshToken = (oldToken: string): string => {
  try {
    // Verificar token actual (aunque esté expirado)
    const decoded = jwt.verify(oldToken, config.JWT_SECRET, {
      ignoreExpiration: true,
      issuer: 'motomar-api',
      audience: 'motomar-users'
    }) as JWTPayload;
    
    // Generar nuevo token con la misma información
    return generateToken({
      userId: decoded.userId,
      email: decoded.email,
      nombre: decoded.nombre,
      apellido: decoded.apellido,
      verificado: decoded.verificado
    }as JWTPayload);
    
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    throw new Error('Token inválido para refresh');
  }
};

export default {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateTokenResponse,
  refreshToken
};
