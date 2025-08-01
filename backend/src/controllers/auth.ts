 // src/controllers/auth.ts
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/bcrypt';
import { generateTokenResponse } from '../utils/jwt';
import type { JWTPayload } from '../utils/jwt';
import { sendWelcomeEmail, sendLoginEmail } from '../utils/email';


// Interfaces para request bodies
interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
   ciudad?: string;
  departamento?: string;
  aceptaPolitica?: boolean; 
}

interface LoginRequest {
  email: string;
  password: string;
}

// =================================
// REGISTRO DE USUARIOS
// =================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      nombre,
      apellido,
      telefono,
      ciudad,
      departamento,
      aceptaPolitica
    }: RegisterRequest = req.body;

    // Validación básica
    if (!email || !password || !nombre || !apellido) {
      res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'Email, contraseña, nombre y apellido son obligatorios',
        required: ['email', 'password', 'nombre', 'apellido']
      });
      return;
    }

    if (!aceptaPolitica) {
      res.status(400).json({
        error: 'Política de tratamiento de datos no aceptada',
        message: 'Debes aceptar la política de tratamiento de datos para registrarte',
      });
      return;
    }
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Email inválido',
        message: 'El formato del email no es válido'
      });
      return;
    }

    // Validar fortaleza de contraseña
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        error: 'Contraseña débil',
        message: 'La contraseña no cumple los requisitos de seguridad',
        errors: passwordValidation.errors,
        score: passwordValidation.score
      });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          ...(telefono ? [{ telefono }] : [])
        ]
      }
    });

    if (existingUser) {
      const conflictField = existingUser.email === email.toLowerCase() ? 'email' : 'teléfono';
      res.status(409).json({
        error: 'Usuario ya existe',
        message: `Ya existe un usuario con ese ${conflictField}`,
        field: conflictField
      });
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const newUser = await prisma.usuario.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono?.trim(),
        ciudad: ciudad?.trim(),
        departamento: departamento?.trim(),
        emailVerificado: false, // En producción enviar email de verificación
        politicaAceptada: aceptaPolitica,
        politicaAceptadaAt: new Date(), // Guardar fecha de aceptación
        activo: true
      }
    });

    // Generar token de acceso
    const tokenPayload: JWTPayload = {
      userId: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      verificado: newUser.emailVerificado
    };

    const tokenResponse = generateTokenResponse(tokenPayload);

    // Enviar email de bienvenida (mejor no bloquear el registro en caso de fallo)
    sendWelcomeEmail(newUser.email, newUser.nombre).catch((err) => {
      console.error('❌ Error al enviar email de bienvenida:', err);
    });                      

    // Respuesta exitosa (sin la contraseña)
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        telefono: newUser.telefono,
        ciudad: newUser.ciudad,
        departamento: newUser.departamento,
        emailVerificado: newUser.emailVerificado,
        calificacion: newUser.calificacion,
        politicaAceptadaAt: newUser.politicaAceptadaAt,
        createdAt: newUser.createdAt
      },
      auth: tokenResponse,
      nextSteps: [
        'Verificar email (próximamente)',
        'Completar perfil',
        'Explorar motos disponibles'
      ]
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al registrar el usuario'
    });
  }
};

// =================================
// LOGIN DE USUARIOS
// =================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validación básica
    if (!email || !password) {
      res.status(400).json({
        error: 'Campos requeridos',
        message: 'Email y contraseña son obligatorios'
      });
      return;
    }

    // Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
      return;
    }

    // Verificar si la cuenta está activa
    if (!user.activo) {
      res.status(403).json({
        error: 'Cuenta desactivada',
        message: 'Tu cuenta ha sido desactivada. Contacta soporte.',
        supportEmail: 'soporte@motomar.com'
      });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
      return;
    }

    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: user.id },
      data: { ultimoAcceso: new Date() }
    });

    // Generar token
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      verificado: user.emailVerificado
    };

    const tokenResponse = generateTokenResponse(tokenPayload);

    // Enviar notificacion de inicio de sesion 
    sendLoginEmail(user.email, user.nombre).catch((err: any) => {
      console.error('❌ Error al enviar email de inicio de sesión:', err);
    });
    
    // Respuesta exitosa
    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        ciudad: user.ciudad,
        departamento: user.departamento,
        emailVerificado: user.emailVerificado,
        calificacion: user.calificacion,
        totalVentas: user.totalVentas,
        totalCompras: user.totalCompras,
        ultimoAcceso: user.ultimoAcceso
      },
      auth: tokenResponse
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al iniciar sesión'
    });
  }
};

// =================================
// OBTENER PERFIL DEL USUARIO ACTUAL
// =================================
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión'
      });
      return;
    }

    // Obtener información completa del usuario
    const user = await prisma.usuario.findUnique({
      where: { id: req.userId },
      include: {
        motosPublicadas: {
          where: { activa: true },
          select: {
            id: true,
            titulo: true,
            precio: true,
            imagenPrincipal: true,
            createdAt: true,
            views: true,
            vendida: true
          }
        },
        _count: {
          select: {
            motosPublicadas: { where: { activa: true } },
            transaccionesVendedor: { where: { estado: 'FINALIZADA' } },
            transaccionesComprador: { where: { estado: 'FINALIZADA' } },
            calificacionesRecibidas: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe'
      });
      return;
    }

    // Calcular estadísticas
    const stats = {
      motosPublicadas: user._count.motosPublicadas,
      ventasCompletadas: user._count.transaccionesVendedor,
      comprasCompletadas: user._count.transaccionesComprador,
      calificacionesRecibidas: user._count.calificacionesRecibidas,
      calificacionPromedio: user.calificacion
    };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        cedula: user.cedula,
        fechaNacimiento: user.fechaNacimiento,
        avatar: user.avatar,
        ciudad: user.ciudad,
        departamento: user.departamento,
        direccion: user.direccion,
        emailVerificado: user.emailVerificado,
        telefonoVerificado: user.telefonoVerificado,
        cedulaVerificada: user.cedulaVerificada,
        calificacion: user.calificacion,
        ultimoAcceso: user.ultimoAcceso,
        createdAt: user.createdAt
      },
      stats,
      motosPublicadas: user.motosPublicadas
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al obtener el perfil'
    });
  }
};

// =================================
// LOGOUT (INVALIDAR TOKEN - PLACEHOLDER)
// =================================
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // En una implementación completa, aquí invalidaríamos el token
    // Por ahora solo enviamos respuesta exitosa
    
    res.json({
      message: 'Logout exitoso',
      note: 'El token seguirá siendo válido hasta su expiración natural'
    });

  } catch (error) {
    console.error('❌ Error en logout:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al cerrar sesión'
    });
  }
};

// =================================
// VALIDAR TOKEN (VERIFICAR SI SIGUE VÁLIDO)
// =================================
export const validateToken = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Token inválido',
        message: 'El token no es válido'
      });
      return;
    }

    res.json({
      valid: true,
      user: req.user,
      message: 'Token válido'
    });

  } catch (error) {
    console.error('❌ Error validando token:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al validar el token'
    });
  }
};

export default {
  register,
  login,
  getProfile,
  logout,
  validateToken
};
