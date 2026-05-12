# ⚡ Inicio Rápido - TestMaster

## 🎯 Añade Tus Preguntas en 3 Pasos

### Paso 1️⃣: Crea el Archivo JSON

Crea un archivo en: `/public/data/asignaturas/nombre-asignatura.json`

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

### Paso 2️⃣: Registra el Archivo

Edita: `/src/app/utils/storage.ts`

```typescript
const JSON_FILES = [
  'ejemplo-matematicas.json',
  'ejemplo-historia.json',
  'nombre-asignatura.json',  // ← Añade aquí
];
```

### Paso 3️⃣: Recarga

Presiona **F5** o **Cmd+R** en el navegador.

---

## 🎨 Colores Disponibles

```
#3B82F6 🔵 Azul       #10B981 🟢 Verde
#EF4444 🔴 Rojo       #F59E0B 🟡 Amarillo
#8B5CF6 🟣 Morado     #EC4899 🌸 Rosa
#F97316 🟠 Naranja    #14B8A6 🔷 Turquesa
```

---

## 📁 Plantilla Lista para Copiar

Duplica el archivo: `/public/data/asignaturas/PLANTILLA.json`

---

## 🔍 Verifica la Carga

Abre la **Consola del Navegador** (F12):

```
✅ Datos cargados: 3 asignaturas, 15 preguntas
```

---

## 📚 Documentación Completa

- **INSTRUCCIONES.md** - Guía paso a paso detallada
- **CAMBIOS.md** - Resumen de modificaciones técnicas
- **/public/data/README.md** - Formato y validación JSON

---

## ✅ Archivos de Ejemplo Incluidos

- `ejemplo-matematicas.json` - 5 preguntas
- `ejemplo-historia.json` - 3 preguntas
- `PLANTILLA.json` - Estructura base

---

## 🚀 ¡Empieza Ahora!

1. Ve a `/public/data/asignaturas/`
2. Copia `PLANTILLA.json` → `mi-asignatura.json`
3. Edita el nombre, color y preguntas
4. Añade `'mi-asignatura.json'` a `storage.ts`
5. Recarga el navegador

**¡Listo para usar!** 🎉
