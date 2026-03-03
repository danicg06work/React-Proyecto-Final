# React Proyecto Final

Aplicación fullstack de videojuegos con React + Vite (frontend) y Express + Sequelize + SQLite (backend).

## Docker

### 1) Frontend dockerizado

- Build de imagen:

```bash
docker compose build frontend
```

- Arranque del contenedor:

```bash
docker compose up -d frontend
```

- Acceso:

`http://localhost:5173`

### 2) Contenedor Ollama + modelo `lfm2.5-thinking`

- Arranque:

```bash
docker compose up -d ollama
```

- Pull del modelo:

```bash
docker exec react-proyecto-ollama ollama pull lfm2.5-thinking
```

- Prueba rápida:

```bash
docker exec react-proyecto-ollama ollama run lfm2.5-thinking "Recomiendame un videojuego de accion"
```

## Asistente IA integrado

- Botón flotante en esquina inferior derecha del frontend.
- Endpoint backend: `POST /api/assistant/chat`.
- Servicio backend: `server/src/services/aiAssistantService.js`.

### Instrucciones de comportamiento del asistente

El asistente está diseñado para:

- responder únicamente sobre videojuegos de la base de datos actual,
- recomendar juegos solo con IDs válidos de esa base,
- rechazar preguntas fuera del dominio de videojuegos de la base,
- no inventar títulos, precios, plataformas ni datos inexistentes.

Variables opcionales del backend para IA:

- `OLLAMA_BASE_URL` (default: `http://localhost:11434`)
- `OLLAMA_MODEL` (default: `lfm2.5-thinking`)
