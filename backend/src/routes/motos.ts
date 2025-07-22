// src/routes/motos.ts
import { Router } from 'express';
import { 
  createMoto, 
  getMotos, 
  getMotoById, 
  getMyMotos, 
  updateMoto, 
  deleteMoto 
} from '../controllers/motos';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { prisma } from '../config/database';
import express from 'express';
import {getMisMotos} from '../controllers/motos';
import { upload } from '../middleware/upload';

const router = Router();



// =================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// =================================

/**
 * GET /api/motos
 * Obtener todas las motos disponibles con filtros
 */
router.get('/', optionalAuth, getMotos);

/* ---------- PROTEGIDAS ---------- */
/*  👇  ***IMPORTANTE***  estas rutas van antes de "/:id" , para evitar errores con img */

/**
 * GET /api/motos/me/all
 * Obtener todas las motas del usuario actual
 */
router.get('/me/all', authenticateToken, getMisMotos);

/**
 * GET /api/motos/me/favoritos
 * Obtener motos favoritas del usuario
 */

router.get('/me/favoritos', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId!;

    const favoritos = await prisma.favoritoMoto.findMany({
      where: { usuarioId: userId },
      include: {
        moto: {
          include: {
            imagenes: {
              take: 1,
              orderBy: { orden: 'asc' }
            },
            vendedor: {
              select: {
                nombre: true,
                apellido: true,
                calificacion: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      favoritos: favoritos.map(f => f.moto),
      total: favoritos.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo favoritos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});



/**
 * GET /api/motos/:id
 * Obtener una moto específica por ID
 */
router.get('/:id', optionalAuth, getMotoById);

// =================================
// RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN)
// =================================

/**
 * POST /api/motos
 * Crear nueva publicación de moto
 */
router.post('/', authenticateToken, createMoto);


/**
 * PUT /api/motos/:id
 * Actualizar una moto existente
 */
router.put('/:id', authenticateToken, updateMoto);

/**
 * DELETE /api/motos/:id
 * Eliminar (desactivar) una moto
 */
router.delete('/:id', authenticateToken, deleteMoto);

// ===============================================
// RUTA PROTEGIDA: Subir imágenes para una moto
// ===============================================

/**
 * POST /api/motos/:id/imagenes
 * Subir hasta 5 imágenes para una moto existente
 */
router.post(
  '/:id/imagenes',
  authenticateToken, // ✅ Asegura que el usuario esté autenticado
  upload.array('imagenes', 5), // ✅ Multer para manejar hasta 5 archivos
  async (req, res) => {
    try {
      const motoId = req.params.id;
      const files = req.files as Express.Multer.File[];

      // ✅ Verificar que la moto existe
      const moto = await prisma.moto.findUnique({
        where: { id: motoId }
      });

      if (!moto) {
        return res.status(404).json({
          error: 'Moto no encontrada'
        });
      }

      // ✅ Crear registros de imágenes en la base de datos
      const imagenes = await prisma.imagenMoto.createMany({
        data: files.map((file) => ({
          url: `/uploads/${file.filename}`,
          motoId,
        })),
      });

      res.json({
        message: '🖼️ Imágenes subidas correctamente',
        imagenes
      });

    } catch (error) {
      console.error('❌ Error al subir imágenes:', error);
      res.status(500).json({
        error: 'Error interno al subir imágenes'
      });
    }
  }
);


// =================================
// RUTAS DE FAVORITOS
// =================================

/**
 * POST /api/motos/:id/favorito
 * Agregar/quitar moto de favoritos
 */
router.post('/:id/favorito', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verificar que la moto existe
    const moto = await prisma.moto.findUnique({
      where: { id, activa: true }
    });

    if (!moto) {
      res.status(404).json({
        error: 'Moto no encontrada'
      });
      return;
    }

    // Verificar si ya es favorito
    const favoritoExistente = await prisma.favoritoMoto.findUnique({
      where: {
        usuarioId_motoId: {
          usuarioId: userId,
          motoId: id
        }
      }
    });

    if (favoritoExistente) {
      // Quitar de favoritos
      await prisma.favoritoMoto.delete({
        where: {
          usuarioId_motoId: {
            usuarioId: userId,
            motoId: id
          }
        }
      });

      res.json({
        message: 'Moto removida de favoritos',
        esFavorito: false
      });
    } else {
      // Agregar a favoritos
      await prisma.favoritoMoto.create({
        data: {
          usuarioId: userId,
          motoId: id
        }
      });

      res.json({
        message: 'Moto agregada a favoritos',
        esFavorito: true
      });
    }

  } catch (error) {
    console.error('❌ Error manejando favorito:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});


// =================================
// RUTAS DE BÚSQUEDA AVANZADA
// =================================

/**
 * GET /api/motos/search/marcas
 * Obtener todas las marcas disponibles
 */
router.get('/search/marcas', async (req, res) => {
  try {
    const marcas = await prisma.moto.groupBy({
      by: ['marca'],
      where: {
        activa: true,
        vendida: false
      },
      _count: {
        marca: true
      },
      orderBy: {
        _count: {
          marca: 'desc'
        }
      }
    });

    res.json({
      marcas: marcas.map(m => ({
        marca: m.marca,
        cantidad: m._count.marca
      }))
    });

  } catch (error) {
    console.error('❌ Error obteniendo marcas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/motos/search/modelos/:marca
 * Obtener modelos de una marca específica
 */
router.get('/search/modelos/:marca', async (req, res) => {
  try {
    const { marca } = req.params;

    const modelos = await prisma.moto.groupBy({
      by: ['modelo'],
      where: {
        marca: { equals: marca, mode: 'insensitive' },
        activa: true,
        vendida: false
      },
      _count: {
        modelo: true
      },
      orderBy: {
        modelo: 'asc'
      }
    });

    res.json({
      marca,
      modelos: modelos.map(m => ({
        modelo: m.modelo,
        cantidad: m._count.modelo
      }))
    });

  } catch (error) {
    console.error('❌ Error obteniendo modelos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/motos/search/ubicaciones
 * Obtener departamentos y ciudades disponibles
 */
router.get('/search/ubicaciones', async (req, res) => {
  try {
    const [departamentos, ciudades] = await Promise.all([
      prisma.moto.groupBy({
        by: ['departamento'],
        where: {
          activa: true,
          vendida: false
        },
        _count: {
          departamento: true
        },
        orderBy: {
          departamento: 'asc'
        }
      }),
      prisma.moto.groupBy({
        by: ['ciudad', 'departamento'],
        where: {
          activa: true,
          vendida: false
        },
        _count: {
          ciudad: true
        },
        orderBy: {
          ciudad: 'asc'
        }
      })
    ]);

    res.json({
      departamentos: departamentos.map(d => ({
        departamento: d.departamento,
        cantidad: d._count.departamento
      })),
      ciudades: ciudades.map(c => ({
        ciudad: c.ciudad,
        departamento: c.departamento,
        cantidad: c._count.ciudad
      }))
    });

  } catch (error) {
    console.error('❌ Error obteniendo ubicaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/motos/search/estadisticas
 * Obtener estadísticas generales del marketplace
 */
router.get('/search/estadisticas', async (req, res) => {
  try {
    const [
      totalMotos,
      totalVendidas,
      precioPromedio,
      marcasMasPopulares
    ] = await Promise.all([
      prisma.moto.count({
        where: { activa: true, vendida: false }
      }),
      prisma.moto.count({
        where: { vendida: true }
      }),
      prisma.moto.aggregate({
        where: { activa: true, vendida: false },
        _avg: { precio: true }
      }),
      prisma.moto.groupBy({
        by: ['marca'],
        where: { activa: true, vendida: false },
        _count: { marca: true },
        orderBy: { _count: { marca: 'desc' } },
        take: 5
      })
    ]);

    res.json({
      totalMotosDisponibles: totalMotos,
      totalMotosVendidas: totalVendidas,
      precioPromedio: Math.round(Number(precioPromedio._avg.precio) || 0),
      marcasMasPopulares: marcasMasPopulares.map(m => ({
        marca: m.marca,
        cantidad: m._count.marca
      }))
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// =================================
// INFO DE LA API DE MOTOS
// =================================

/**
 * GET /api/motos/info
 * Información sobre la API de motos
 */
router.get('/info', (req, res) => {
  res.json({
    name: 'MotoMar Motos API',
    version: '1.0.0',
    description: 'API completa para gestión de motocicletas',
    endpoints: {
      public: {
        'GET /': 'Listar todas las motos con filtros',
        'GET /:id': 'Obtener moto específica',
        'GET /search/marcas': 'Obtener marcas disponibles',
        'GET /search/modelos/:marca': 'Obtener modelos de una marca',
        'GET /search/ubicaciones': 'Obtener ubicaciones disponibles',
        'GET /search/estadisticas': 'Estadísticas del marketplace'
      },
      protected: {
        'POST /': 'Crear nueva moto',
        'GET /me/all': 'Mis motos publicadas',
        'GET /me/favoritos': 'Mis motos favoritas',
        'PUT /:id': 'Actualizar mi moto',
        'DELETE /:id': 'Eliminar mi moto',
        'POST /:id/favorito': 'Agregar/quitar favorito'
      }
    },
    examples: {
      createMoto: {
        url: 'POST /api/motos',
        headers: { 'Authorization': 'Bearer <token>' },
        body: {
          titulo: 'Honda CB 190R 2022 Como Nueva',
          descripcion: 'Moto en excelente estado, poco uso, papeles al día',
          precio: 8500000,
          marca: 'Honda',
          modelo: 'CB 190R',
          año: 2022,
          cilindraje: 184,
          kilometraje: 5000,
          color: 'Rojo',
          ciudad: 'Bogotá',
          departamento: 'Cundinamarca'
        }
      },
      searchMotos: {
        url: 'GET /api/motos?marca=Honda&precioMax=10000000&ciudad=Bogotá'
      }
    }
  });
});

export default router;