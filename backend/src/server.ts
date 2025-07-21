 // src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment';
import { connectDatabase, seedDatabase } from './config/database';

// Crear aplicación Express
const app = express();

// =================================
// MIDDLEWARES GLOBALES
// =================================

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: [config.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Logging
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =================================
// RUTAS DE SALUD
// =================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MotoMar API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: '1.0.0'
  });
});

// Info de la API
app.get('/api', (req, res) => {
  res.json({
    name: 'MotoMar API',
    description: 'Marketplace seguro para compra y venta de motos en Colombia',
    version: '1.0.0',
    author: 'Juan Andres Perez Gallego',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      motos: '/api/motos/*',
      chat: '/api/chat/*',
      transactions: '/api/transactions/*'
    },
    documentation: 'https://github.com/PereZzZzZ580/motomar'
  });
});

// =================================
// RUTAS PRINCIPALES (próximamente)
// =================================

// app.use('/api/auth', authRoutes); --- ya importada--
import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);

// app.use('/api/users', userRoutes);

// app.use('/api/motos', motosRoutes); -- ya importada--
import motosRoutes from './routes/motos';
app.use('/api/motos', motosRoutes);

// app.use('/api/chat', chatRoutes);
// app.use('/api/transactions', transactionRoutes);

// app.use('/api/users', (req, res) => {
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname,'..', 'uploads')));

// =================================
// MANEJO DE ERRORES
// =================================

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en esta API`,
    availableEndpoints: ['/health', '/api']
  });
});

// Manejo global de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error en la aplicación:', err);
  
  res.status(err.status || 500).json({
    error: config.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =================================
// INICIALIZAR SERVIDOR
// =================================

const startServer = async () => {
  try {
    // Conectar base de datos
    await connectDatabase();
    
    // Crear datos iniciales si no existen
    await seedDatabase();
    
    // Iniciar servidor
    app.listen(config.PORT, () => {
      console.log('🚀 ================================');
      console.log('🏍️  MotoMar API iniciado exitosamente');
      console.log('🚀 ================================');
      console.log(`📡 Servidor corriendo en puerto: ${config.PORT}`);
      console.log(`🌐 URL local: http://localhost:${config.PORT}`);
      console.log(`🔧 Entorno: ${config.NODE_ENV}`);
      console.log(`💾 Base de datos: Conectada`);
      console.log('🚀 ================================');
      console.log('');
      console.log('📋 Endpoints disponibles:');
      console.log(`   GET  http://localhost:${config.PORT}/health`);
      console.log(`   GET  http://localhost:${config.PORT}/api`);
      console.log('');
      console.log('✅ ¡Listo para recibir peticiones!');
    });
    
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();

export default app;
