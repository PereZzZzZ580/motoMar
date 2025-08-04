## Plan de Seguridad Mínimo

### Almacenamiento
- **Base de datos**: se puede usar PostgreSQL o MongoDB en la nube (por ejemplo, Supabase, Railway, MongoDB Atlas).

### Cifrado
- **Contraseñas**: se cifran con bcrypt.
- **Imágenes**: si son privadas, usar rutas firmadas o tokens temporales.

### Acceso
- **Rutas del backend**: protegidas con autenticación (JWT, middleware).
- **Panel de administración**: incluir control de acceso (futuro).

### Registro de consentimientos
- Guardar el campo `consent_data`: `{ accepted: true, date: Date }` al crear una cuenta.
- Registrar los consentimientos en la consola/backend para evidencia.