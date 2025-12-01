# 📜 Scripts de Mantenimiento de Base de Datos

Este directorio contiene scripts útiles para el mantenimiento y gestión de la base de datos de P-Music.

## 🗂️ Scripts Disponibles

### 1. `clean_database.py`
**Propósito:** Limpia completamente la base de datos y reorganiza los archivos uploads.

**Uso:**
```bash
cd src/backend
python scripts/clean_database.py
```

**Acciones:**
- ❌ Elimina todos los usuarios, canciones, álbumes y playlists
- 🗑️ Limpia el directorio `uploads/` 
- 📁 Recrea estructura organizada de uploads:
  ```
  uploads/
  ├── songs/          # Archivos de audio
  ├── covers/
  │   ├── songs/      # Portadas de canciones
  │   └── albums/     # Portadas de álbumes
  └── avatars/        # Avatares de usuarios
  ```

**⚠️ ADVERTENCIA:** Esta operación es irreversible. Todos los datos se perderán.

---

### 2. `seed_database.py`
**Propósito:** Crea usuarios iniciales del sistema para desarrollo y pruebas.

**Uso:**
```bash
cd src/backend
python scripts/seed_database.py
```

**Usuarios Creados:**

| Email | Usuario | Contraseña | Rol | Permisos |
|-------|---------|------------|-----|----------|
| `andres@gmail.com` | Andrés | `password123` | ADMIN |  Subir contenido<br> Eliminar contenido<br> Gestión completa |
| `creator@pmusic.com` | P-Music Creator | `password123` | CREATOR |  Subir contenido<br> Auto-aprobación |
| `moderator@pmusic.com` | Moderador P-Music | `password123` | ADMIN |  Gestión completa<br> Moderar contenido |

**Características:**
-  Todos los usuarios están pre-verificados
-  No requiere confirmación de email
-  Listos para usar inmediatamente
-  Contraseñas hasheadas con bcrypt

---

### 3. `check_song.py`
**Propósito:** Verificar detalles de una canción específica y sus archivos.

**Uso:**
```bash
cd src/backend
python scripts/check_song.py
```

**Información mostrada:**
- ID, título, artista
- Rutas de archivo y portada
- Tamaño del archivo
- Estado de aprobación
- Verificación de existencia física del archivo

---

### 4. `fix_paths.py`
**Propósito:** Corrige rutas con separadores incorrectos (backslashes en Windows).

**Uso:**
```bash
cd src/backend
python scripts/fix_paths.py
```

**Acciones:**
- Reemplaza `\` por `/` en todas las rutas de la BD
- Asegura compatibilidad con URLs
- Actualiza campos `file_path` y `cover_url`

---

##  Flujo de Trabajo Recomendado

### Para desarrollo inicial:
```bash
# 1. Limpiar todo (base de datos + archivos)
python scripts/clean_database.py

# 2. Crear usuarios base
python scripts/seed_database.py

# 3. Iniciar servidor
cd ..
uvicorn main:app --reload
```

### Para resetear datos de prueba:
```bash
# Solo limpiar base de datos
python scripts/clean_database.py

# Recrear usuarios
python scripts/seed_database.py
```

---

##  Notas Importantes

1. **Backup:** Antes de ejecutar `clean_database.py` en datos reales, asegúrate de tener un backup.

2. **Entorno:** Estos scripts deben ejecutarse desde el directorio `src/backend` para que las rutas funcionen correctamente.

3. **Base de datos:** Los scripts asumen que existe el archivo `music.db` en `src/backend/`.

4. **Permisos:** En producción, cambia las contraseñas después del primer login.

5. **Archivos:** `clean_database.py` elimina TODOS los archivos en uploads excepto `.gitkeep`.

---

##  Troubleshooting

### Error: "No module named 'database'"
```bash
# Asegúrate de estar en src/backend
cd src/backend
python scripts/script_name.py
```

### Error: "database is locked"
```bash
# Detén el servidor FastAPI primero
# Ctrl+C en la terminal del servidor
# Luego ejecuta el script
```

### Uploads no se crean
```bash
# Verifica permisos de escritura
# En Windows: No es necesario cambiar permisos
# En Linux/Mac:
chmod -R 755 uploads/
``` 