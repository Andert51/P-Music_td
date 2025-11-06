# 🎵 P-Music TD - Planificación de Sprints

## 📋 Descripción General

Este proyecto se desarrolló en 4 sprints (4 semanas), cada uno con un MVP funcional que demuestra la evolución progresiva del sistema de streaming de música.

---

## 🗓️ Sprint 1 - Semana 1: Fundamentos y Autenticación

### 🎯 Objetivo
Establecer la base del proyecto con autenticación, diseño visual y reproducción básica.

### ✅ Entregables
- **Backend**:
  - Sistema de autenticación completo (registro, login, JWT)
  - Modelo de usuarios con roles (USER, CREATOR, ADMIN)
  - Endpoints básicos de usuarios
  - Base de datos PostgreSQL configurada

- **Frontend**:
  - Diseño completo con tema Gruvbox
  - Página de Login/Registro funcional
  - Layout principal con sidebar y header
  - Hero section estática
  - Reproductor visual básico (sin funcionalidad)

### 🔧 Tecnologías
- FastAPI + SQLAlchemy + PostgreSQL
- React + TypeScript + Tailwind CSS
- JWT para autenticación

### 📊 Estado: MVP Funcional
✅ Usuario puede registrarse e iniciar sesión  
✅ Interfaz completa y navegable  
✅ Diseño visual profesional  

---

## 🗓️ Sprint 2 - Semana 2: Gestión de Contenido

### 🎯 Objetivo
Implementar la subida y gestión de canciones individuales y álbumes.

### ✅ Entregables
- **Backend**:
  - Modelo de canciones y álbumes
  - Endpoints para subir canciones/álbumes
  - Sistema de almacenamiento de archivos
  - Endpoints para listar y obtener canciones
  - Cálculo de duración de archivos MP3

- **Frontend**:
  - Página de subida de canciones/álbumes
  - Listado de canciones en Home
  - Página de álbumes con detalles
  - Reproductor funcional (play, pause, skip)
  - Barra de progreso y controles de volumen

### 🔧 Nuevas Funcionalidades
- Reproducción de audio con Howler.js
- Upload de archivos con validación
- Gestión de estado con Zustand
- Visualización de duraciones reales

### 📊 Estado: MVP Funcional
✅ Usuario puede subir canciones y álbumes  
✅ Reproducción completa de audio  
✅ Navegación entre canciones  
✅ Control de volumen y progreso  

---

## 🗓️ Sprint 3 - Semana 3: Interacción Social

### 🎯 Objetivo
Agregar funcionalidades sociales: likes, búsqueda y playlists.

### ✅ Entregables
- **Backend**:
  - Sistema de likes (tabla liked_songs)
  - Endpoints de búsqueda con filtros
  - Modelo y endpoints de playlists
  - Relaciones playlist-canciones
  - Endpoints de gestión de playlists

- **Frontend**:
  - Sistema de likes en todas las vistas
  - Buscador funcional con resultados en tiempo real
  - Página de canciones favoritas
  - Creación y gestión de playlists
  - Modal para agregar canciones a playlists
  - Biblioteca de playlists

### 🔧 Nuevas Funcionalidades
- Búsqueda por título y artista
- Sistema de favoritos persistente
- Playlists personalizadas
- Modal reutilizable de playlists

### 📊 Estado: MVP Funcional
✅ Usuario puede buscar canciones  
✅ Sistema de likes completo  
✅ Creación y gestión de playlists  
✅ Biblioteca personal organizada  

---

## 🗓️ Sprint 4 - Semana 4: Pulido y Optimización

### 🎯 Objetivo
Completar funcionalidades faltantes y optimizar la experiencia de usuario.

### ✅ Entregables
- **Funcionalidades Completas**:
  - Botones de like/playlist en todas las vistas
  - Estados sincronizados en tiempo real
  - Duraciones reales de archivos MP3
  - Modal de playlists desde el reproductor
  - Sistema de gestión completo en PlaylistDetail

- **Optimizaciones**:
  - Carga optimizada de estados
  - Animaciones fluidas con Framer Motion
  - Responsive design mejorado
  - Manejo de errores robusto
  - Scripts de limpieza de base de datos

- **Herramientas de Desarrollo**:
  - Script de limpieza de BD (respeta foreign keys)
  - Script de seeding de usuarios
  - Documentación completa

### 🔧 Mejoras Técnicas
- Validación exhaustiva de formularios
- Optimización de consultas a BD
- Sincronización de estados
- Manejo de casos edge
- Toast notifications consistentes

### 📊 Estado: Proyecto Completo
✅ Sistema totalmente funcional  
✅ UX pulida y consistente  
✅ Código mantenible y escalable  
✅ Documentación completa  

---

## 📈 Evolución del Proyecto

```
Sprint 1: 🔐 Auth + 🎨 UI Base
    ↓
Sprint 2: 🎵 Contenido + ▶️ Reproducción
    ↓
Sprint 3: ❤️ Social + 🔍 Búsqueda + 📋 Playlists
    ↓
Sprint 4: ✨ Pulido + 🚀 Optimización
    ↓
✅ PROYECTO FINAL
```

---

## 🚀 Cómo Ejecutar Cada Sprint

### Sprint 1
```bash
cd MVP/sprint-1
# Instrucciones en sprint-1/README.md
```

### Sprint 2
```bash
cd MVP/sprint-2
# Instrucciones en sprint-2/README.md
```

### Sprint 3
```bash
cd MVP/sprint-3
# Instrucciones en sprint-3/README.md
```

### Sprint 4
```bash
# Este es el proyecto completo en la raíz
cd ../../
```

---

## 📊 Métricas de Progreso

| Sprint | Funcionalidades | Líneas de Código | Complejidad |
|--------|----------------|------------------|-------------|
| 1 | Auth + UI | ~2,500 | ⭐⭐ |
| 2 | Contenido + Player | ~5,000 | ⭐⭐⭐ |
| 3 | Social + Playlists | ~8,000 | ⭐⭐⭐⭐ |
| 4 | Proyecto Final | ~10,000 | ⭐⭐⭐⭐⭐ |

---

## 🎓 Aprendizajes por Sprint

### Sprint 1
- Configuración de proyecto full-stack
- Autenticación con JWT
- Diseño de sistema con Tailwind CSS

### Sprint 2
- Manejo de archivos multimedia
- Reproducción de audio con Web Audio API
- Estado global con Zustand

### Sprint 3
- Relaciones complejas en base de datos
- Sistemas de búsqueda y filtrado
- Modales y componentes reutilizables

### Sprint 4
- Optimización de rendimiento
- Sincronización de estados
- Mejores prácticas de desarrollo

---

## 📝 Notas

- Cada sprint es **independiente y funcional**
- Los sprints 1-3 usan endpoints con prefijo `/mvp/sprint-X/` para no interferir con el proyecto final
- El Sprint 4 es el proyecto completo en la raíz del repositorio
- Todos los sprints incluyen su propia documentación y base de datos

