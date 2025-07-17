 // src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import { prisma } from '../config/database';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      userId?: string;
    }
  }
}

// Middleware principal de autenticación
export const authenticateToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Extraer token del header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      res.status(401).json({
        error: 'Token de acceso requerido',
        message: 'Debes iniciar sesión para acceder a este recurso'
      });
      return;
    }
    
    // Verificar token
    const decoded = verifyToken(token);
    
    // Verificar que el usuario aún existe en la base de datos
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        emailVerificado: true,
        activo: true,
        ultimoAcceso: true
      }
    });
    
    if (!user) {
      res.status(401).json({
        error: 'Usuario no encontrado',
        message: 'El usuario asociado al token no existe'
      });
      return;
    }
    
    if (!user.activo) {
      res.status(401).json({
        error: 'Cuenta desactivada',
        message: 'Tu cuenta ha sido desactivada. Contacta soporte.'
      });
      return;
    }
    
    // Actualizar último acceso (opcional, puede ser pesado en producción)
    await prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoAcceso: new Date() }
    });
    
    // Añadir información del usuario al request
    req.user = {
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      verificado: user.emailVerificado
    };
    req.userId = user.id;
    
    next();
    
  } catch (error: any) {
    console.error('❌ Error en autenticación:', error);
    
    if (error.message === 'Token expirado') {
      res.status(401).json({
        error: 'Token expirado',
        message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.message === 'Token inválido') {
      res.status(401).json({
        error: 'Token inválido',
        message: 'Token de acceso inválido'
      });
    } else {
      res.status(500).json({
        error: 'Error interno',
        message: 'Error verificando autenticación'
      });
    }
  }
};

// Middleware opcional de autenticación (no falla si no hay token)
export const optionalAuth = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyToken(token);
      
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.userId, activo: true },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          emailVerificado: true
        }
      });
      
      if (user) {
        req.user = {
          userId: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          verificado: user.emailVerificado
        };
        req.userId = user.id;
      }
    }
    
    next();
    
  } catch (error) {
    // En autenticación opcional, ignoramos errores
    next();
  }
};

// Middleware para verificar que el usuario esté verificado
export const requireVerifiedUser = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Autenticación requerida',
      message: 'Debes iniciar sesión'
    });
    return;
  }
  
  if (!req.user.verificado) {
    res.status(403).json({
      error: 'Verificación requerida',
      message: 'Debes verificar tu email para acceder a esta función',
      code: 'EMAIL_NOT_VERIFIED'
    });
    return;
  }
  
  next();
};

// Middleware para verificar roles específicos (para futuro)
export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: 'Autenticación requerida'
      });
      return;
    }
    
    // TODO: Implementar sistema de roles en el futuro
    // Por ahora todos los usuarios autenticados pueden acceder
    next();
  };
};

// Middleware para rate limiting por usuario
export const userRateLimit = (maxRequests: number, windowMs: number) => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userId) {
      next();
      return;
    }
    
    const now = Date.now();
    const userKey = req.userId;
    const userLimit = userRequests.get(userKey);
    
    if (!userLimit || now > userLimit.resetTime) {
      userRequests.set(userKey, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }
    
    if (userLimit.count >= maxRequests) {
      res.status(429).json({
        error: 'Demasiadas peticiones',
        message: 'Has excedido el límite de peticiones. Intenta más tarde.',
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
      });
      return;
    }
    
    userLimit.count++;
    next();
  };
};

export default {
  authenticateToken,
  optionalAuth,
  requireVerifiedUser,
  requireRole,
  userRateLimit
};
