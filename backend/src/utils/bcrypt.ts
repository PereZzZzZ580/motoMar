 // src/utils/bcrypt.ts
import bcrypt from 'bcryptjs';

// Configuración
const SALT_ROUNDS = 12; // Mayor seguridad para producción

// Encriptar contraseña
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Generar salt y hash
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword;
  } catch (error) {
    console.error('❌ Error encriptando contraseña:', error);
    throw new Error('Error procesando contraseña');
  }
};

// Verificar contraseña
export const comparePassword = async (
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('❌ Error comparando contraseñas:', error);
    throw new Error('Error verificando contraseña');
  }
};

// Validar fortaleza de contraseña
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} => {
  const errors: string[] = [];
  let score = 0;
  
  // Longitud mínima
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  } else {
    score += 1;
  }
  
  // Contiene mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  } else {
    score += 1;
  }
  
  // Contiene minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  } else {
    score += 1;
  }
  
  // Contiene número
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  } else {
    score += 1;
  }
  
  // Contiene carácter especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial (!@#$%^&*...)');
  } else {
    score += 1;
  }
  
  // Longitud extra
  if (password.length >= 12) {
    score += 1;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(score, 5) // Máximo 5 puntos
  };
};

// Generar contraseña temporal segura
export const generateTempPassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

// Verificar si la contraseña necesita ser actualizada (rehash)
export const needsRehash = async (hashedPassword: string): Promise<boolean> => {
  try {
    // bcrypt automáticamente detecta si necesita rehash
    const saltRounds = bcrypt.getRounds(hashedPassword);
    return saltRounds < SALT_ROUNDS;
  } catch (error) {
    // Si hay error leyendo el hash, mejor rehashear
    return true;
  }
};

export default {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  generateTempPassword,
  needsRehash
};
