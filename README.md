# massimovenezia.com

Sitio de links personal (estilo Linktree), desplegado como Cloudflare
Worker. El `src/worker.js` renderiza el HTML final en el servidor a partir
de `public/content.json` — nada del contenido depende de que el visitante
(o un crawler) ejecute JavaScript. Eso importa para SEO/GEO: la mayoría de
los bots de IA (GPTBot, ClaudeBot, PerplexityBot, etc.) no ejecutan JS, así
que si el contenido solo existiera vía JS no lo verían.

## Editar contenido

Todo el contenido (nombre, links, foto) está en **`public/content.json`**.
Es JSON plano — las claves van entre comillas. No hace falta tocar HTML,
CSS ni el Worker. Después de editarlo hay que volver a desplegar
(`npx wrangler deploy`) para que se vea el cambio, igual que con cualquier
otro archivo del sitio.

Los links se muestran como iconos (sin texto), tomados de
`public/icons.json`. Para agregar una red que no esté ahí, sumá su clave y
su path SVG en `icons.json` y después referencialo desde `content.json`.

Para poner tu foto (grande, horizontal, arriba del nombre):
1. Copiá la imagen a `public/assets/photo.jpg`
2. En `public/content.json`, cambiá `"photo": null` por
   `"photo": "/assets/photo.jpg"`

## Cambiar colores / tipografía

Variables en la parte de arriba de `public/styles.css` (`:root { ... }`).

## Cómo se arma el HTML (SEO/GEO)

`src/worker.js` importa `content.json` e `icons.json` y, en cada request,
reescribe el HTML estático de `public/index.html` para inyectar:

- El nombre, la foto y los links reales (no vacíos, no armados por JS).
- Datos estructurados `schema.org/Person` (con las redes como `sameAs`) en
  un `<script type="application/ld+json">`, para que buscadores y motores
  de IA puedan asociar el nombre con cada cuenta directamente.
- La `<meta name="description">` en español o inglés según el país del
  visitante (ver más abajo).

`public/deeplinks.js` es el único JS del lado del cliente que queda, y es
puramente una mejora progresiva (intenta abrir apps nativas en mobile) — el
sitio funciona igual de completo sin él.

**Importante:** en `wrangler.toml`, `[assets]` tiene `run_worker_first =
true`. Sin eso, Cloudflare sirve los archivos estáticos directo y se saltea
el Worker por completo — nada de lo de arriba se aplicaría.

## Deep links a las apps (mobile)

`public/deeplinks.js` intenta abrir la app nativa al tocar un ícono desde el
celular, solo para las redes que tienen un esquema de URL propio confiable
(X, YouTube). Para Instagram y TikTok no hay un esquema estable: se dejan
como links normales (sin `target="_blank"`) para que el tap sea una
navegación real y el sistema operativo pueda resolver su propio Universal
Link / App Link si la app está instalada.

Si en algún momento Instagram vuelve a soportar bien su esquema propio, se
puede sumar de nuevo el caso `"instagram"` en `buildAppUrl()`.

Dentro del navegador propio de Instagram/TikTok (el que se abre al tocar un
link "en la bio"), esas apps bloquean a propósito el salto a otras apps —
eso no se puede evitar con código del sitio. La única forma real de
abrirlas ahí es que la persona toque "⋯" y elija "Abrir en el navegador".

## Descripción según idioma / país

`src/worker.js` reescribe el `<meta name="description">` (y
`og:description` / `twitter:description`) al español o inglés según el país
del visitante (`request.cf.country`, que ya resuelve Cloudflare en el
edge). Los textos están en el objeto `COPY` de ese archivo; la lista de
países en español en `SPANISH_SPEAKING_COUNTRIES`.

Esto cambia lo que ve una persona real al abrir el link. No cambia el
snippet que indexa Google: los buscadores rastrean desde su propia
ubicación fija, así que ahí siempre se ve un solo idioma.

## Imagen para compartir (OG image)

`index.html` referencia `/assets/og-image.jpg` (1200x630) para la vista
previa al compartir el link en redes (WhatsApp, X, iMessage, etc.).

## robots.txt / sitemap.xml

`public/robots.txt` permite el acceso a todos los crawlers (incluidos los
de IA) y apunta a `public/sitemap.xml`, que lista la única URL del sitio.

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
