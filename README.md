# 🎓 TestMaster - Aplicación de Tests por Asignaturas

> Sistema moderno de gestión y realización de tests educativos con carga desde archivos JSON

---

## 🚀 Inicio Rápido

### ⚡ Para Empezar Inmediatamente
**Lee:** [`INICIO-RAPIDO.md`](./INICIO-RAPIDO.md) - 3 pasos para añadir tus preguntas

### 📚 Para Entender Todo el Sistema
**Lee:** [`INSTRUCCIONES.md`](./INSTRUCCIONES.md) - Guía completa paso a paso

---

## 📖 Documentación Disponible

| Documento | Descripción | Para Quién |
|-----------|-------------|------------|
| **[INICIO-RAPIDO.md](./INICIO-RAPIDO.md)** | Empieza en 3 pasos | Usuarios nuevos |
| **[INSTRUCCIONES.md](./INSTRUCCIONES.md)** | Guía completa detallada | Todos |
| **[CAMBIOS.md](./CAMBIOS.md)** | Resumen de modificaciones | Desarrolladores |
| **[ESTRUCTURA.md](./ESTRUCTURA.md)** | Mapa del proyecto | Desarrolladores |
| **[/public/data/README.md](./public/data/README.md)** | Formato JSON | Creadores de contenido |

---

## ✨ Características

✅ **Gestión por Asignaturas**
- Carga automática desde archivos JSON
- Colores identificativos por asignatura
- Vista organizada y filtrable

✅ **Dos Modos de Test**
- Por asignatura específica
- Aleatorio (mezcla todas las asignaturas)

✅ **Configuración Flexible**
- Número de preguntas personalizable
- Orden aleatorio opcional
- Temporizador automático

✅ **Resultados Detallados**
- Puntuación y tiempo
- Respuestas correctas/incorrectas
- Explicación de cada pregunta

✅ **Historial Completo**
- Guarda todos los tests realizados
- Estadísticas de rendimiento
- Persistencia local

✅ **Diseño Responsive**
- Funciona en móvil, tablet y desktop
- Interfaz moderna y profesional
- Experiencia optimizada

---

## 🗂️ Estructura Básica

```
📁 /public/data/asignaturas/    ← TUS ARCHIVOS JSON AQUÍ
   ├── ejemplo-matematicas.json
   ├── ejemplo-historia.json
   ├── PLANTILLA.json
   └── [tus-archivos].json

📄 /src/app/utils/storage.ts     ← CONFIGURA ARCHIVOS AQUÍ
```

---

## 🎯 Uso Básico

### 1️⃣ Añadir Asignatura

Crea un archivo JSON en `/public/data/asignaturas/`:

```json
{
  "subject": {
    "name": "Mi Asignatura",
    "color": "#3B82F6"
  },
  "questions": [
    {
      "question": "¿Tu pregunta?",
      "options": {
        "A": "Opción A",
        "B": "Opción B",
        "C": "Opción C",
        "D": "Opción D"
      },
      "correctAnswer": "A"
    }
  ]
}
```

### 2️⃣ Registrar Archivo

Edita `/src/app/utils/storage.ts`:

```typescript
const JSON_FILES = [
  'ejemplo-matematicas.json',
  'tu-archivo.json',  // ← Añade aquí
];
```

### 3️⃣ Recargar

Presiona **F5** en el navegador y verifica la consola:

```
✅ Datos cargados: 2 asignaturas, 10 preguntas
```

---

## 🎨 Paleta de Colores

```
Azul      #3B82F6 🔵    Verde     #10B981 🟢
Rojo      #EF4444 🔴    Amarillo  #F59E0B 🟡
Morado    #8B5CF6 🟣    Rosa      #EC4899 🌸
Naranja   #F97316 🟠    Turquesa  #14B8A6 🔷
```

---

## 📦 Instalación y Desarrollo

### Requisitos
- Node.js 18+
- pnpm (gestor de paquetes)

### Instalación
```bash
pnpm install
```

### Desarrollo
El servidor de desarrollo ya está ejecutándose. Los cambios se reflejan automáticamente.

---

## 🔧 Tecnologías

| Tecnología | Uso |
|------------|-----|
| **React 18** | Framework principal |
| **TypeScript** | Tipado estático |
| **Tailwind CSS v4** | Estilos |
| **Radix UI** | Componentes UI |
| **Vite** | Build tool |
| **Lucide React** | Iconos |
| **Sonner** | Notificaciones |

---

## 📁 Archivos de Ejemplo Incluidos

- **`ejemplo-matematicas.json`** - 5 preguntas de matemáticas básicas
- **`ejemplo-historia.json`** - 3 preguntas de historia universal
- **`PLANTILLA.json`** - Plantilla vacía lista para usar

---

## 🔍 Validación de JSON

### Online
1. Copia tu JSON
2. Visita: https://jsonlint.com/
3. Pega y valida

### Consola del Navegador
Abre con **F12** y busca mensajes como:

```
✓ archivo.json: Asignatura (5 preguntas)   ← OK
⚠️ archivo.json: No se pudo cargar         ← Error
```

---

## 💾 Almacenamiento

| Tipo | Ubicación | Modificable |
|------|-----------|-------------|
| **Asignaturas** | Archivos JSON | ✅ Solo archivos |
| **Preguntas** | Archivos JSON | ✅ Solo archivos |
| **Historial** | localStorage | ✅ Desde la UI |

---

## 🚨 Modo de Solo Lectura

La aplicación carga los datos en **modo de solo lectura** para proteger los archivos originales.

**Para modificar datos:**
1. Edita los archivos JSON directamente
2. Recarga el navegador (F5)
3. Los cambios se reflejan inmediatamente

**No se puede desde la UI:**
- ❌ Crear/editar/eliminar asignaturas
- ❌ Crear/editar/eliminar preguntas

**Sí se puede desde la UI:**
- ✅ Realizar tests
- ✅ Ver resultados
- ✅ Consultar historial
- ✅ Eliminar historial

---

## 📊 Componentes Principales

### Dashboard
Vista principal con accesos rápidos y estadísticas

### Asignaturas
Lista de todas las asignaturas con sus colores

### Preguntas
Banco completo de preguntas con filtro por asignatura

### Configurar Test
Elige modo, asignatura y número de preguntas

### Realizar Test
Interfaz interactiva con temporizador

### Resultados
Vista detallada de respuestas y puntuación

### Historial
Registro completo de tests anteriores

---

## 🎓 Flujo de Trabajo Educativo

```
1. Preparar Contenido
   └─> Crear archivos JSON con preguntas por asignatura

2. Cargar en la Aplicación
   └─> Registrar archivos en storage.ts

3. Estudiar
   └─> Revisar preguntas en el banco

4. Practicar
   └─> Realizar tests por asignatura o aleatorios

5. Evaluar
   └─> Revisar resultados y áreas de mejora

6. Iterar
   └─> Añadir más preguntas y repetir
```

---

## 🌟 Casos de Uso

✅ **Estudiantes**
- Practicar para exámenes
- Repasar contenido por asignatura
- Medir progreso con el historial

✅ **Profesores**
- Crear baterías de preguntas
- Organizar por temas/asignaturas
- Compartir archivos JSON con estudiantes

✅ **Academias**
- Sistema de práctica para alumnos
- Tests personalizados por curso
- Seguimiento de rendimiento

✅ **Autodidactas**
- Organizar conocimientos
- Practicar conceptos
- Evaluar aprendizaje

---

## 📱 Uso Responsive

### Móvil (< 768px)
- Menú hamburguesa
- Layout de 1 columna
- Botones táctiles grandes

### Tablet (768px - 1024px)
- Layout de 2 columnas
- Menú adaptativo

### Desktop (> 1024px)
- Layout de 3 columnas
- Menú completo visible

---

## 🛠️ Solución de Problemas

### ❌ No se cargan las asignaturas
1. Verifica que los archivos estén en `/public/data/asignaturas/`
2. Revisa que estén registrados en `storage.ts`
3. Abre la consola (F12) para ver errores

### ❌ JSON inválido
1. Usa un validador online: https://jsonlint.com/
2. Verifica comillas dobles (`"`)
3. Comprueba comas entre elementos

### ❌ Preguntas no aparecen
1. Verifica estructura: `questions` debe ser un array
2. Comprueba campos obligatorios en cada pregunta
3. Revisa que `options` tenga A, B, C, D

---

## 📞 Soporte y Recursos

### Documentación
- **Inicio Rápido:** [`INICIO-RAPIDO.md`](./INICIO-RAPIDO.md)
- **Guía Completa:** [`INSTRUCCIONES.md`](./INSTRUCCIONES.md)
- **Formato JSON:** [`/public/data/README.md`](./public/data/README.md)

### Ejemplos
- **Matemáticas:** [`ejemplo-matematicas.json`](./public/data/asignaturas/ejemplo-matematicas.json)
- **Historia:** [`ejemplo-historia.json`](./public/data/asignaturas/ejemplo-historia.json)
- **Plantilla:** [`PLANTILLA.json`](./public/data/asignaturas/PLANTILLA.json)

---

## 🎯 Próximos Pasos

1. **📖 Lee:** [`INICIO-RAPIDO.md`](./INICIO-RAPIDO.md)
2. **🔍 Explora:** Los archivos de ejemplo incluidos
3. **✏️ Crea:** Tu primer archivo JSON
4. **✅ Prueba:** Realiza un test en la aplicación
5. **📚 Expande:** Añade más asignaturas

---

## 📝 Notas de Versión

**Versión 2.0 - Sistema JSON** (12/05/2026)
- ✅ Carga automática desde archivos JSON
- ✅ Sistema de validación integrado
- ✅ Modo de solo lectura
- ✅ Logs detallados en consola
- ⚠️ Eliminada importación desde Word

**Versión 1.0 - Sistema localStorage** (anterior)
- Importación desde archivos Word (.docx)
- Almacenamiento en localStorage
- Edición directa en UI

---

## 🎉 Características Destacadas

### 🎨 Interfaz Moderna
Diseño limpio y profesional con Tailwind CSS

### ⚡ Carga Rápida
Datos en memoria para acceso instantáneo

### 🔒 Datos Protegidos
Sistema de solo lectura para preservar originales

### 📊 Estadísticas
Historial completo con métricas de rendimiento

### 🎲 Aleatoriedad
Tests diferentes cada vez con orden aleatorio

### ⏱️ Temporizador
Mide tu velocidad de respuesta

---

## 🏁 Conclusión

TestMaster es una solución completa para gestionar y realizar tests educativos organizados por asignaturas. Con su sistema de carga desde JSON, es fácil de configurar y mantener.

**¡Empieza ahora!** Lee [`INICIO-RAPIDO.md`](./INICIO-RAPIDO.md) y crea tu primer test en 3 pasos.

---

**Desarrollado con ❤️ para facilitar el aprendizaje**

**Fecha:** Mayo 2026  
**Versión:** 2.0 - Sistema JSON
#   A t l a s  
 