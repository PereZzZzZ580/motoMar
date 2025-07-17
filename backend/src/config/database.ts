 // src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { config } from './environment';

// Crear instancia global de Prisma
declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern para evitar múltiples conexiones
export const prisma = global.__prisma || new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// En desarrollo, usar variable global para hot reload
if (config.NODE_ENV === 'development') {
  global.__prisma = prisma;
}

// Manejar desconexión limpia
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Función para verificar conexión
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('🗄️  Base de datos conectada exitosamente');
    
    // Verificar que las tablas existen
    const userCount = await prisma.usuario.count();
    console.log(`📊 Base de datos inicializada (${userCount} usuarios)`);
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

// Función para ejecutar seeds (datos iniciales)
export const seedDatabase = async () => {
  try {
    // Verificar si ya hay datos
    const existingUsers = await prisma.usuario.count();
    
    if (existingUsers === 0) {
      console.log('🌱 Creando datos iniciales...');
      
      // Crear usuario admin de prueba
      await prisma.usuario.create({
        data: {
          email: 'admin@motomar.com',
          password: '$2a$10$8K1p/a9aOCXzDe2REKWm7uY/TgqZt1Q3GdJJ3SfoBs6YfZRQtD5qC', // password: admin123
          nombre: 'Administrador',
          apellido: 'MotoMar',
          cedula: '1234567890',
          ciudad: 'Bogotá',
          departamento: 'Cundinamarca',
          emailVerificado: true,
          cedulaVerificada: true,
          calificacion: 5.0,
        }
      });
      
      console.log('✅ Usuario admin creado: admin@motomar.com / admin123');
      console.log('🎉 Base de datos inicializada con datos de prueba');
    }
  } catch (error) {
    console.error('❌ Error creando datos iniciales:', error);
  }
};

export default prisma;
