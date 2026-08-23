/**
 * ─────────────────────────────────────────────────────────────
 * CONFIGURACIÓN DEL SITIO — editá lo que quieras acá.
 * No hace falta tocar HTML/CSS para cambiar textos, links o foto.
 * ─────────────────────────────────────────────────────────────
 */
window.SITE_CONFIG = {
  profile: {
    // Nombre. Se muestra como una sola línea.
    name: "Massimo Venezia",

    // Foto de perfil.
    // - Dejalo en null para mostrar el monograma "MV" como placeholder.
    // - Cuando tengas la foto, ponela en public/assets/avatar.jpg (o .png/.webp)
    //   y cambiá esta línea a: avatar: "/assets/avatar.jpg"
    avatar: null,
  },

  // Links que se muestran, como iconos, en orden. Agregá, borrá o reordená.
  // "icon" tiene que ser una de las claves definidas en public/icons.js
  // (instagram, x, tiktok, youtube). Si agregás una red que no está ahí,
  // sumale el path SVG correspondiente en icons.js primero.
  links: [
    { icon: "instagram", label: "Instagram", url: "https://instagram.com/massimoveneziaa" },
    { icon: "tiktok", label: "TikTok", url: "https://tiktok.com/@massimovenezia" },
    { icon: "youtube", label: "YouTube", url: "https://www.youtube.com/@massimo_venezia" },
    { icon: "x", label: "X", url: "https://x.com/massimovenezia" },
  ],

  // Texto del pie de página. Podés dejarlo vacío: "".
  footer: `© ${new Date().getFullYear()} Massimo Venezia`,
};
