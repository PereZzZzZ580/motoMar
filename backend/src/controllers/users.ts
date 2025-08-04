// backend/src/controllers/users.ts
import { Request, Response } from "express";
import prisma from "../config/database";
import { comparePassword, hashPassword } from "../utils/bcrypt";

// Cambia la contraseña del usuario autenticado
enxport async function changePassword(req: Request, res: Response) {
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
enxport async function toggle2FA(req: Request, res: Response) {
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
enxport async function updatePrivacy(req: Request, res: Response) {
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

// Obtiene las sesiones activas del usuario (requiere modelo Session en Prisma)
enxport async function getSessions(req: Request, res: Response) {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.userId },
      select: { id: true, device: true, lastActive: true },
      orderBy: { lastActive: 'desc' },
    });
    return res.json(sessions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo sesiones" });
  }
}

// Revoca (elimina) una sesión activa
enxport async function revokeSession(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.session.delete({ where: { id } });
    return res.json({ message: "Sesión revocada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error revocando sesión" });
  }
}

// Exporta datos del usuario y sus motos asociadas
enxport async function exportData(req: Request, res: Response) {
  try {
    // Obtener datos básicos del usuario
    const user = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: { id: true, nombre: true, apellido: true, email: true, createdAt: true }
    });

    // Obtener motos con imágenes
    const motos = await prisma.moto.findMany({
      where: { usuarioId: req.userId },
      include: { imagenes: true }
    });

    return res.json({ user, motos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error exportando datos" });
  }
}

// Elimina la cuenta del usuario y sus datos asociados
enxport async function deleteAccount(req: Request, res: Response) {
  try {
    await prisma.usuario.delete({ where: { id: req.userId } });
    return res.json({ message: "Cuenta eliminada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error eliminando cuenta" });
  }
}
