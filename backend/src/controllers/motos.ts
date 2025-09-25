 // src/controllers/motos.ts
import { Request, Response , NextFunction} from 'express';
import { prisma } from '../config/database';
import { z } from 'zod';

// Interfaces para request bodies
interface CreateMotoRequest {
  titulo: string;
  descripcion: string;
  precio: number;
  negociable?: boolean;
  marca: string;
  modelo: string;
  año: number;
  cilindraje: number;
  kilometraje: number;
  color: string;
  combustible?: 'GASOLINA' | 'ELECTRICA' | 'HIBRIDA';
  transmision?: 'MANUAL' | 'AUTOMATICA' | 'SEMI_AUTOMATICA';
  estado?: 'NUEVA' | 'USADO' | 'PARA_REPUESTOS';
  condicion?: 'EXCELENTE' | 'MUY_BUENA' | 'BUENA' | 'REGULAR' | 'NECESITA_REPARACION';
  soatVigente?: boolean;
  tecnoVigente?: boolean;
  papalesAlDia?: boolean;
  frenos?: 'DISCO' | 'TAMBOR' | 'MIXTO' | 'ABS' | 'CBS';
  llantas?: 'NUEVAS' | 'BUENAS' | 'REGULARES' | 'NECESITAN_CAMBIO';
  mantenimiento?: string;
  accesorios?: string;
  ciudad: string;
  departamento: string;
  barrio?: string;
  imagenes?: string[];
}

interface SearchFilters {
  marca?: string;
  modelo?: string;
  añoMin?: number;
  añoMax?: number;
  precioMin?: number;
  precioMax?: number;
  cilindrajeMin?: number;
  cilindrajeMax?: number;
  kilometrajeMax?: number;
  ciudad?: string;
  departamento?: string;
  combustible?: string;
  transmision?: string;
  estado?: string;
  condicion?: string;
  soatVigente?: boolean;
  tecnoVigente?: boolean;
  papalesAlDia?: boolean;
  query?: string; // Búsqueda por texto
}

const motoSchema = z.object({
   titulo: z.string().min(2),
  descripcion: z.string().min(20),
  precio: z.coerce.number().positive(),
  negociable: z.boolean().default(true),

  marca: z.string().min(2),
  modelo: z.string().min(1),
  año: z.coerce.number().int()
    .gte(1950)
    .lte(new Date().getFullYear() + 1),
  cilindraje: z.coerce.number().int().positive(),
  kilometraje: z.coerce.number().int().nonnegative(),
  color: z.string().min(2),
  combustible: z.enum(['GASOLINA','ELECTRICA','HIBRIDA']).default('GASOLINA'),
  transmision: z.enum(['MANUAL','AUTOMATICA','SEMI_AUTOMATICA']).default('MANUAL'),
  estado: z.enum(['NUEVA','USADO','PARA_REPUESTOS']).default('USADO'),
  condicion: z.enum(['EXCELENTE','MUY_BUENA','BUENA','REGULAR','NECESITA_REPARACION']).default('BUENA'),

  soatVigente: z.boolean().default(false),
  tecnoVigente: z.boolean().default(false),
  papalesAlDia: z.boolean().default(false),
  frenos: z.enum(['DISCO','TAMBOR','MIXTO','ABS','CBS']).optional(),
  llantas: z.enum(['NUEVAS','BUENAS','REGULARES','NECESITAN_CAMBIO']).optional(),
  mantenimiento: z.string().optional(),
  accesorios: z.string().optional(),

  ciudad: z.string().min(2),
  departamento: z.string().min(2),
  barrio: z.string().optional(),

  imagenes: z.array(z.string().url()).optional(),
});

// =================================
// CREAR NUEVA MOTO
// =================================
export const createMoto = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión para publicar una moto'
      });
      return;
    }

    const {
      titulo,
      descripcion,
      precio,
      negociable = true,
      marca,
      modelo,
      año,
      cilindraje,
      kilometraje,
      color,
      combustible = 'GASOLINA',
      transmision = 'MANUAL',
      estado = 'USADO',
      condicion = 'BUENA',
      soatVigente = false,
      tecnoVigente = false,
      papalesAlDia = false,
      frenos,
      llantas,
      mantenimiento,
      accesorios,
      ciudad,
      departamento,
      barrio,
      imagenes = []
    }: CreateMotoRequest = req.body;

    // Validaciones básicas
    if (!titulo || !descripcion || !precio || !marca || !modelo || !año || !cilindraje || !kilometraje || !color || !ciudad || !departamento) {
      res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'Todos los campos básicos son obligatorios',
        required: ['titulo', 'descripcion', 'precio', 'marca', 'modelo', 'año', 'cilindraje', 'kilometraje', 'color', 'ciudad', 'departamento']
      });
      return;
    }

    // Validaciones de rangos
    const currentYear = new Date().getFullYear();
    if (año < 1950 || año > currentYear + 1) {
      res.status(400).json({
        error: 'Año inválido',
        message: `El año debe estar entre 1950 y ${currentYear + 1}`
      });
      return;
    }

    if (precio <= 0) {
      res.status(400).json({
        error: 'Precio inválido',
        message: 'El precio debe ser mayor a 0'
      });
      return;
    }

    if (cilindraje <= 0 || cilindraje > 5000) {
      res.status(400).json({
        error: 'Cilindraje inválido',
        message: 'El cilindraje debe estar entre 1 y 5000 cc'
      });
      return;
    }

    if (kilometraje < 0) {
      res.status(400).json({
        error: 'Kilometraje inválido',
        message: 'El kilometraje no puede ser negativo'
      });
      return;
    }

    // Crear la moto
    const newMoto = await prisma.moto.create({
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        precio: precio,
        negociable,
        marca: marca.trim(),
        modelo: modelo.trim(),
        año,
        cilindraje,
        kilometraje,
        color: color.trim(),
        combustible,
        transmision,
        estado,
        condicion,
        soatVigente,
        tecnoVigente,
        papalesAlDia,
        frenos,
        llantas,
        mantenimiento: mantenimiento?.trim(),
        accesorios: accesorios?.trim(),
        ciudad: ciudad.trim(),
        departamento: departamento.trim(),
        barrio: barrio?.trim(),
        imagenPrincipal: imagenes[0] || null,
        vendedorId: req.userId,
        activa: true,
        vendida: false,
        destacada: false,
        views: 0
      }
    });

    // Crear registros de imágenes si existen
    if (imagenes.length > 0) {
      const imagenesData = imagenes.map((url, index) => ({
        url,
        alt: `${marca} ${modelo} - Imagen ${index + 1}`,
        orden: index,
        motoId: newMoto.id
      }));

      await prisma.imagenMoto.createMany({
        data: imagenesData
      });
    }

    // Obtener la moto completa con imágenes
    const motoCompleta = await prisma.moto.findUnique({
      where: { id: newMoto.id },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            calificacion: true,
            totalVentas: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Moto publicada exitosamente',
      moto: motoCompleta,
      nextSteps: [
        'Compartir en redes sociales',
        'Responder a interesados rápidamente',
        'Mantener información actualizada'
      ]
    });

  } catch (error) {
    console.error('❌ Error creando moto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al publicar la moto'
    });
  }
};

  export const uploadMotoImages = async (
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> => {

  try {
    const motoId = req.params.id;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No se recibieron imágenes' });
      return;
    }

    const moto = await prisma.moto.findUnique ({ where : { id : motoId } });
 
    if (!moto) {
      res. status ( 404 ). json ( { error : 'Motorcycle not found' });
      return;
    }
    const existing = await prisma.imagenMoto.count({ where: { motoId } });


    const imagenes = await Promise.all(
      files.map((file, idx) =>
        prisma.imagenMoto.create({
          data: {
            motoId,
            url: file.path,
            alt: `${moto.marca} ${moto.modelo} - Imagen ${existing + idx + 1}`,
            orden: existing + idx,
          },
        })
      )
    );

     if (!moto.imagenPrincipal && imagenes. length > 0 )
 {
      await prisma.moto.update({
        where: { id: motoId },
        data : { imagenPrincipal : imagenes[ 0 ]. url },
      });
    }

    res.status(201).json({
      message : '🖼️ Images uploaded successfully' ,
      imagenes,
    });

  } catch (error) {
    console.error('❌ Error subiendo imágenes:', error);
    res.status(500).json({
      error:'Error interno',
      message: 'No se pudieron subir las imágenes',
    });
  }
};
    


// =================================
// OBTENER TODAS LAS MOTOS (CON FILTROS)
// =================================
export const getMotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      marca,
      modelo,
      añoMin,
      añoMax,
      precioMin,
      precioMax,
      cilindrajeMin,
      cilindrajeMax,
      kilometrajeMax,
      ciudad,
      departamento,
      combustible,
      transmision,
      estado,
      condicion,
      soatVigente,
      tecnoVigente,
      papalesAlDia,
      query,
      page = '1',
      limit = '20',
      orderBy = 'createdAt',
      order = 'desc'
    } = req.query as any;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {
      activa: true,
      vendida: false
    };

    // Filtros de texto
    if (marca) where.marca = { contains: marca, mode: 'insensitive' };
    if (modelo) where.modelo = { contains: modelo, mode: 'insensitive' };
    if (ciudad) where.ciudad = { contains: ciudad, mode: 'insensitive' };
    if (departamento) where.departamento = { contains: departamento, mode: 'insensitive' };

    // Filtros de enums
    if (combustible) where.combustible = combustible;
    if (transmision) where.transmision = transmision;
    if (estado) where.estado = estado;
    if (condicion) where.condicion = condicion;

    // Filtros booleanos
    if (soatVigente !== undefined) where.soatVigente = soatVigente === 'true';
    if (tecnoVigente !== undefined) where.tecnoVigente = tecnoVigente === 'true';
    if (papalesAlDia !== undefined) where.papalesAlDia = papalesAlDia === 'true';

    // Filtros de rango
    if (añoMin || añoMax) {
      where.año = {};
      if (añoMin) where.año.gte = parseInt(añoMin);
      if (añoMax) where.año.lte = parseInt(añoMax);
    }

    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio.gte = parseFloat(precioMin);
      if (precioMax) where.precio.lte = parseFloat(precioMax);
    }

    if (cilindrajeMin || cilindrajeMax) {
      where.cilindraje = {};
      if (cilindrajeMin) where.cilindraje.gte = parseInt(cilindrajeMin);
      if (cilindrajeMax) where.cilindraje.lte = parseInt(cilindrajeMax);
    }

    if (kilometrajeMax) {
      where.kilometraje = { lte: parseInt(kilometrajeMax) };
    }

    // Búsqueda por texto general
    if (query) {
      where.OR = [
        { titulo: { contains: query, mode: 'insensitive' } },
        { descripcion: { contains: query, mode: 'insensitive' } },
        { marca: { contains: query, mode: 'insensitive' } },
        { modelo: { contains: query, mode: 'insensitive' } },
        { color: { contains: query, mode: 'insensitive' } }
      ];
    }

    // Ordenamiento
    const orderByObj: any = {};
    if (orderBy === 'precio') orderByObj.precio = order;
    else if (orderBy === 'año') orderByObj.año = order;
    else if (orderBy === 'kilometraje') orderByObj.kilometraje = order;
    else if (orderBy === 'views') orderByObj.views = order;
    else orderByObj.createdAt = order;

    // Ejecutar consultas
    const [motos, total] = await Promise.all([
      prisma.moto.findMany({
        where,
        include: {
          imagenes: {
            orderBy: { orden: 'asc' },
            take: 1 // Solo la primera imagen para el listado
          },
          vendedor: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              calificacion: true,
              ciudad: true,
              departamento: true
            }
          },
          _count: {
            select: {
              favoritos: true
            }
          }
        },
        orderBy: orderByObj,
        skip,
        take: limitNum
      }),
      prisma.moto.count({ where })
    ]);

    const motosConFavoritos = await Promise.all(
       motos.map(async (moto) => {
        if (req.userId) {
          const esFavorito = await prisma.favoritoMoto.findFirst({
        where: {
          usuarioId: req.userId,
          motoId: moto.id
        }
        });
        return { 
            ...moto, 
            es_favorito: !!esFavorito // Convertir a boolean
          };
        }
        return { 
          ...moto, 
          es_favorito: false 
        };
      })
    );


    // Calcular metadata de paginación
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    res.json({
      motos: motosConFavoritos,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage
      },
      filters: {
        applied: Object.keys(req.query).length > 0 ? req.query : null,
        available: {
          marcas: await prisma.moto.groupBy({
            by: ['marca'],
            where: { activa: true, vendida: false },
            _count: true
          }),
          departamentos: await prisma.moto.groupBy({
            by: ['departamento'],
            where: { activa: true, vendida: false },
            _count: true
          })
        }
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo motos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al obtener las motos'
    });
  }
};

// =================================
// OBTENER MOTO POR ID
// =================================
export const getMotoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const moto = await prisma.moto.findUnique({
      where: { id },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono : true,
            calificacion: true,
            totalVentas: true,
            ciudad: true,
            departamento: true,
            createdAt: true
          }
        },
        favoritos: req.userId ? {
          where: { usuarioId: req.userId }
        } : false,
        _count: {
          select: {
            favoritos: true
          }
        }
      }
    });

    if (!moto) {
      res.status(404).json({
        error: 'Moto no encontrada',
        message: 'La moto que buscas no existe o ha sido eliminada'
      });
      return;
    }

    if (!moto.activa) {
      res.status(404).json({
        error: 'Moto no disponible',
        message: 'Esta moto ya no está disponible'
      });
      return;
    }

    // Incrementar views (solo si no es el dueño)
    if (req.userId !== moto.vendedorId) {
      await prisma.moto.update({
        where: { id },
        data: { views: { increment: 1 } }
      });
    }

    // Obtener motos similares
    const motosSimilares = await prisma.moto.findMany({
      where: {
        id: { not: id },
        activa: true,
        vendida: false,
        OR: [
          { marca: moto.marca },
          { 
            AND: [
              { precio: { gte: Number (moto.precio) * 0.8 } },
              { precio: { lte: Number (moto.precio) * 1.2 } }
            ]
          },
          { cilindraje: moto.cilindraje },
          { departamento: moto.departamento }
        ]
      },
      include: {
        imagenes: { take: 1, orderBy: { orden: 'asc' } },
        vendedor: {
          select: {
            nombre: true,
            apellido: true,
            calificacion: true
          }
        }
      },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      moto: {
        ...moto,
        esFavorito: req.userId ? moto.favoritos.length > 0 : false,
        favoritos: undefined // No exponer la relación completa
      },
      motosSimilares,
      vendedorVerificado: moto.vendedor.calificacion >= 4.0
    });

  } catch (error) {
    console.error('❌ Error obteniendo moto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al obtener la moto'
    });
  }
};

// =================================
// OBTENER MOTOS DEL USUARIO ACTUAL
// =================================
export const getMyMotos = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión'
      });
      return;
    }

    const { status = 'all' } = req.query;

    const where: any = {
      vendedorId: req.userId
    };

    if (status === 'active') where.activa = true;
    else if (status === 'sold') where.vendida = true;
    else if (status === 'inactive') where.activa = false;

    const motos = await prisma.moto.findMany({
      where,
      include: {
        imagenes: {
          take: 1,
          orderBy: { orden: 'asc' }
        },
        _count: {
          select: {
            favoritos: true,
            conversaciones: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const estadisticas = {
      total: motos.length,
      activas: motos.filter(m => m.activa && !m.vendida).length,
      vendidas: motos.filter(m => m.vendida).length,
      inactivas: motos.filter(m => !m.activa).length,
      totalViews: motos.reduce((sum, m) => sum + m.views, 0),
      totalFavoritos: motos.reduce((sum, m) => sum + m._count.favoritos, 0)
    };

    res.json({
      motos,
      estadisticas
    });

  } catch (error) {
    console.error('❌ Error obteniendo mis motos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al obtener tus motos'
    });
  }
};

// =================================
// ACTUALIZAR MOTO
// =================================
export const updateMoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión'
      });
      return;
    }

    // Verificar que la moto existe y pertenece al usuario
    const motoExistente = await prisma.moto.findUnique({
      where: { id }
    });

    if (!motoExistente) {
      res.status(404).json({
        error: 'Moto no encontrada',
        message: 'La moto que intentas actualizar no existe'
      });
      return;
    }

    if (motoExistente.vendedorId !== req.userId) {
      res.status(403).json({
        error: 'Sin permisos',
        message: 'Solo puedes editar tus propias motos'
      });
      return;
    }

    // Actualizar solo los campos proporcionados
    const motoActualizada = await prisma.moto.update({
      where: { id },
      data: {
        ...req.body,
        updatedAt: new Date()
      },
      include: {
        imagenes: {
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
    });

    res.json({
      message: 'Moto actualizada exitosamente',
      moto: motoActualizada
    });

  } catch (error) {
    console.error('❌ Error actualizando moto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al actualizar la moto'
    });
  }
};

// =================================
// ELIMINAR MOTO (SOFT DELETE)
// =================================
export const deleteMoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión'
      });
      return;
    }

    // Verificar permisos
    const moto = await prisma.moto.findUnique({
      where: { id }
    });

    if (!moto) {
      res.status(404).json({
        error: 'Moto no encontrada'
      });
      return;
    }

    if (moto.vendedorId !== req.userId) {
      res.status(403).json({
        error: 'Sin permisos',
        message: 'Solo puedes eliminar tus propias motos'
      });
      return;
    }

    // Soft delete - desactivar en lugar de eliminar
    await prisma.moto.update({
      where: { id },
      data: {
        activa: false,
        updatedAt: new Date()
      }
    });
  
    // Eliminar de favoritos todas las refencias a esta moto
    await prisma.favoritoMoto.deleteMany({
      where: { motoId: id }
    });

    res.json({
      message: 'Moto eliminada exitosamente',
      note: 'La moto se ha desactivado pero se mantiene en el historial'
    });

  } catch (error) {
    console.error('❌ Error eliminando moto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al eliminar la moto'
    });
  }
};

// =================================
// MARCAR MOTO COMO VENDIDA
// =================================
export const marcarVendida = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión',
      });
      return;
    }

    const moto = await prisma.moto.findUnique({ where: { id } });

    if (!moto) {
      res.status(404).json({ error: 'Moto no encontrada' });
      return;
    }

    if (moto.vendedorId !== req.userId) {
      res.status(403).json({
        error: 'Sin permisos',
        message: 'Solo puedes modificar tus propias motos',
      });
      return;
    }

    if (moto.vendida) {
      res.status(400).json({ message: 'La moto ya está marcada como vendida' });
      return;
    }

    await prisma.moto.update({
      where: { id },
      data: {
        vendida: true,
        activa: false,
        updatedAt: new Date(),
      },
    });

    await prisma.usuario.update({
      where: { id: req.userId },
      data: { totalVentas: { increment: 1 } },
    });

    res.json({ message: 'Moto marcada como vendida' });

  } catch (error) {
    console.error('❌ Error marcando moto como vendida:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

// =================================
// OBTENER MIS MOTOS (SOLO VENDEDOR) 
// =================================
// esta funcion es para obtener las motos del usuario autenticado
// se usa en el dashboard del usuario
// =================================
// OBTENER MIS MOTOS (DASHBOARD USUARIO)
// =================================
export const getMisMotos = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const motos = await prisma.moto.findMany({
      where: { 
        vendedorId: userId,
        activa: true,  // Solo motos activas
        vendida: false  // Solo motos no vendidas
      },
      include: {
        imagenes: {
          orderBy: { orden: 'asc' }, // Mostrar siempre imagen principal primero
          take: 1
        },
        _count: {
          select: { favoritos: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(motos);
  } catch (error) {
    console.error('❌ Error obteniendo mis motos:', error);
    res.status(500).json({
      error: 'Error obteniendo tus motos'
    });
  }
};


export default {
  createMoto,
  getMotos,
  getMotoById,
  getMyMotos,
  getMisMotos,
  updateMoto,
  deleteMoto,
  marcarVendida,
  uploadMotoImages,
};
