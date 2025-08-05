// backend/src/controllers/users.ts
import { Request, Response } from "express";
import prisma from "../config/database";
import { comparePassword, hashPassword } from "../utils/bcrypt";

// Cambia la contraseña del usuario autenticado
export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    // Obtener usuario desde la base de datos
    const user = await prisma.usuario.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Verificar contraseña actual
    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Contraseña actual incorrecta" });
    }
    // Hashear nueva contraseña y guardar
    const hashed = await hashPassword(newPassword);
    await prisma.usuario.update({ where: { id: req.userId }, data: { password: hashed } });
    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error cambiando contraseña" });
  }
}

// Activa o desactiva la autenticación de dos factores
export async function toggle2FA(req: Request, res: Response) {
  try {
    const { enable } = req.body as { enable: boolean };
    const user = await prisma.usuario.update({
      where: { id: req.userId },
      data: { twoFactorEnabled: enable },
    });
    return res.json({ message: `2FA ${enable ? "activada" : "desactivada"}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando 2FA" });
  }
}

// Actualiza preferencias de privacidad del usuario
export async function updatePrivacy(req: Request, res: Response) {
  try {
    const { publicProfile, emailNotifications } = req.body as {
      publicProfile: boolean;
      emailNotifications: boolean;
    };
    const user = await prisma.usuario.update({
      where: { id: req.userId },
      data: { publicProfile, emailNotifications },
    });
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando privacidad" });
  }
}

// Actualiza datos básicos del perfil del usuario
export async function updateProfile(req: Request, res: Response) {
  try {
    const { nombre, apellido, telefono, ciudad, departamento, bio } = req.body;
    const user = await prisma.usuario.update({
      where: { id: req.userId },
      data: { nombre, apellido, telefono, ciudad, departamento, bio },
    });
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando perfil" });
  }
}

// Obtiene las sesiones activas del usuario (requiere modelo Session en Prisma)
export async function getSessions(req: Request, res: Response) {
  try {
    const sesiones = await prisma.sesionUsuario.findMany({
      where: { usuarioId: req.userId },
      select: { id: true, userAgent: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    const sessions = sesiones.map((s) => ({
      id: s.id,
      device: s.userAgent,
      lastActive: s.createdAt,
    }));
    return res.json(sessions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo sesiones" });
  }
}

// Revoca (elimina) una sesión activa
export async function revokeSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.sesionUsuario.delete({ where: { id } });
    return res.json({ message: "Sesión revocada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error revocando sesión" });
  }
}

// Exporta datos del usuario y sus motos asociadas
export async function exportData(req: Request, res: Response) {
  try {
    // Obtener datos básicos del usuario
    const user = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: { id: true, nombre: true, apellido: true, email: true, createdAt: true }
    });

    // Obtener motos con imágenes
    const motos = await prisma.moto.findMany({
      where: { vendedorId: req.userId },
      include: { imagenes: true }
    });

    return res.json({ user, motos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error exportando datos" });
  }
}

// Elimina la cuenta del usuario y sus datos asociados
export async function deleteAccount(req: Request, res: Response) {
  try {
    await prisma.usuario.delete({ where: { id: req.userId } });
    return res.json({ message: "Cuenta eliminada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error eliminando cuenta" });
  }
}
