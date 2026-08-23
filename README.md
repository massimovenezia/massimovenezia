# massimovenezia.com

Sitio de links personal (estilo Linktree), 100% HTML/CSS/JS sin build step,
desplegado como Cloudflare Worker (static assets).

## Editar contenido

Todo el contenido (nombre, links, foto) está en **`public/content.js`**.
Los comentarios ahí explican cada campo. No hace falta tocar HTML ni CSS.

Los links se muestran como iconos (sin texto), tomados de `public/icons.js`.
Para agregar una red que no esté ahí, sumá su path SVG en `icons.js` y
después referencialo desde `content.js`.

Para poner tu foto (grande, horizontal, arriba del nombre):
1. Copiá la imagen a `public/assets/photo.jpg`
2. En `public/content.js`, cambiá `photo: null` por `photo: "/assets/photo.jpg"`

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
