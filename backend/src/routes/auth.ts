 // src/routes/auth.ts
import { Router } from 'express';
import { register, login, getProfile, logout, validateToken } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// =================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// =================================

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', login);

// =================================
// RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN)
// =================================

/**
 * GET /api/auth/me
 * Obtener perfil del usuario actual
 * Requiere: Authorization Bearer token
 */
router.get('/me', authenticateToken, getProfile);

/**
 * POST /api/auth/logout
 * Cerrar sesión (invalidar token)
 * Requiere: Authorization Bearer token
 */
router.post('/logout', authenticateToken, logout);

/**
 * GET /api/auth/validate
 * Validar si el token sigue siendo válido
 * Requiere: Authorization Bearer token
 */
router.get('/validate', authenticateToken, validateToken);

// =================================
// RUTAS FUTURAS (PRÓXIMAMENTE)
// =================================

/**
 * POST /api/auth/forgot-password
 * Solicitar reset de contraseña
 */
router.post('/forgot-password', (req, res) => {
  res.status(501).json({
    message: 'Funcionalidad próximamente',
    feature: 'Reset de contraseña'
  });
});

/**
 * POST /api/auth/reset-password
 * Confirmar reset de contraseña
 */
router.post('/reset-password', (req, res) => {
  res.status(501).json({
    message: 'Funcionalidad próximamente',
    feature: 'Confirmar reset de contraseña'
  });
});

/**
 * POST /api/auth/verify-email
 * Verificar email del usuario
 */
router.post('/verify-email', (req, res) => {
  res.status(501).json({
    message: 'Funcionalidad próximamente',
    feature: 'Verificación de email'
  });
});

/**
 * POST /api/auth/resend-verification
 * Reenviar email de verificación
 */
router.post('/resend-verification', authenticateToken, (req, res) => {
  res.status(501).json({
    message: 'Funcionalidad próximamente',
    feature: 'Reenvío de verificación'
  });
});

/**
 * POST /api/auth/change-password
 * Cambiar contraseña (estando logueado)
 */
router.post('/change-password', authenticateToken, (req, res) => {
  res.status(501).json({
    message: 'Funcionalidad próximamente',
    feature: 'Cambio de contraseña'
  });
});

/**
 * DELETE /api/auth/account
 * Eliminar cuenta de usuario
 */
router.delete('/account', authenticateToken, (req, res) => {
  res.status(501).json({
    message: 'Funcionalidad próximamente',
    feature: 'Eliminación de cuenta'
  });
});

// =================================
// INFO DE LA API DE AUTENTICACIÓN
// =================================

/**
 * GET /api/auth
 * Información sobre endpoints de autenticación
 */
router.get('/', (req, res) => {
  res.json({
    name: 'MotoMar Authentication API',
    version: '1.0.0',
    description: 'Sistema de autenticación seguro para MotoMar',
    endpoints: {
      public: {
        'POST /register': 'Registrar nuevo usuario',
        'POST /login': 'Iniciar sesión',
        'POST /forgot-password': 'Solicitar reset de contraseña (próximamente)',
        'POST /reset-password': 'Confirmar reset de contraseña (próximamente)'
      },
      protected: {
        'GET /me': 'Obtener perfil del usuario actual',
        'POST /logout': 'Cerrar sesión',
        'GET /validate': 'Validar token actual',
        'POST /verify-email': 'Verificar email (próximamente)',
        'POST /resend-verification': 'Reenviar verificación (próximamente)',
        'POST /change-password': 'Cambiar contraseña (próximamente)',
        'DELETE /account': 'Eliminar cuenta (próximamente)'
      }
    },
    authentication: {
      type: 'JWT Bearer Token',
      header: 'Authorization: Bearer <token>',
      expiration: '7 days'
    },
    examples: {
      register: {
        url: 'POST /api/auth/register',
        body: {
          email: 'usuario@ejemplo.com',
          password: 'MiPassword123!',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '3001234567',
          ciudad: 'Bogotá',
          departamento: 'Cundinamarca'
        }
      },
      login: {
        url: 'POST /api/auth/login',
        body: {
          email: 'usuario@ejemplo.com',
          password: 'MiPassword123!'
        }
      }
    }
  });
});

export default router;
