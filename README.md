# Vacunas

Gestión de vacunas y vacunaciones para el ámbito de Nación y Jurisdicciones.

## Configuración del sistema

Asegurate de instalar las dependencias:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist

```

## Servidor de desarrollo

Verificar que exista un archivo .env con las entradas que se encuentran en .env.example

Iniciar el servidor de desarrollo en http://localhost:3000

```bash
npm run dev
```

## Despliegue en producción

Construir la aplicación para producción:

```bash
npm run build
```

Previsualizar la construcción de producción localmente:

```bash
npm run preview
```

Para más información consultar la [documentación de despliegue](https://v3.nuxtjs.org/guide/deploy/presets).
