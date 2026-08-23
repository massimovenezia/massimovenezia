# massimovenezia.com

Sitio de links personal (estilo Linktree), 100% HTML/CSS/JS sin build step,
desplegado como Cloudflare Worker (static assets).

## Editar contenido

Todo el contenido (nombre, bio, links, foto) está en **`public/content.js`**.
Los comentarios ahí explican cada campo. No hace falta tocar HTML ni CSS.

Para poner tu foto de perfil:
1. Copiá la imagen a `public/assets/avatar.jpg`
2. En `public/content.js`, cambiá `avatar: null` por `avatar: "/assets/avatar.jpg"`

## Cambiar colores / tipografía

Variables en la parte de arriba de `public/styles.css` (`:root { ... }`).

## Imagen para compartir (OG image)

`index.html` referencia `/assets/og-image.jpg` (1200x630) para la vista previa
al compartir el link en redes. Agregá esa imagen en `public/assets/` cuando
tengas una; si no existe, el sitio funciona igual, solo no se ve la miniatura.

## Correr localmente

```
npx wrangler dev
```

## Desplegar

```
npx wrangler deploy
```

Esto publica el sitio como Worker y lo cuelga en `massimovenezia.com` y
`www.massimovenezia.com` (dominios personalizados configurados en
`wrangler.toml`).
