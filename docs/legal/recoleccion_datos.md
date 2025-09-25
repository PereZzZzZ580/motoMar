# Recolección de Datos Personales En VeloMark

Este proyecto almacena diversos datos necesarios para operar el marketplace de motos.

## Datos del usuario (`Usuario`)
- **nombre** y **apellido**
- **email**
- **telefono**
- **password** (almacenada de forma cifrada)
- **cedula**
- **fechaNacimiento**
- **avatar**
- **emailVerificado**, **telefonoVerificado**, **cedulaVerificada**
- **ciudad**, **departamento**, **direccion**
- **calificacion**, **totalVentas**, **totalCompras**
- **activo** y **ultimoAcceso**
- Fechas de creación y actualización

## Datos de sesión (`SesionUsuario`)
- **ipAddress**
- **userAgent**
- **token** y estado de la sesión
- Fechas de creación y expiración

## Datos de la moto (`Moto`)
- **placa** y **número de chasis** (cuando se solicitan)
- **modelo**, **marca**, **año** y demás especificaciones
- **precio**, **estado** y **condición**
- Otra información técnica como **cilindraje**, **kilometraje** y **color**

## Otros datos automáticos
- Imágenes de la moto (`ImagenMoto`)
- Ubicación de la publicación (ciudad, departamento, barrio)
- Dirección IP y agente de usuario de cada sesión
- Fechas de publicación y actualización de los registros
- Ubicacion (di el usuario habilita geolocalizacion)

### Seguridad de las contraseñas
Las contraseñas se almacenan de forma segura utilizando funciones de hash implementadas en [`backend/src/utils/bcrypt.ts`](../../backend/src/utils/bcrypt.ts).
