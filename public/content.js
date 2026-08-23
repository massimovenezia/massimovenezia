/**
 * ─────────────────────────────────────────────────────────────
 * CONFIGURACIÓN DEL SITIO — editá lo que quieras acá.
 * No hace falta tocar HTML/CSS para cambiar textos, links o foto.
 * ─────────────────────────────────────────────────────────────
 */
window.SITE_CONFIG = {
  profile: {
    // Nombre. Se muestra en dos líneas: firstName / lastName.
    firstName: "Massimo",
    lastName: "Venezia",

    // Texto chico arriba del nombre (small caps). Podés poner tu @ o lo que quieras.
    eyebrow: "@massimovenezia",

    // Bajada / bio corta debajo del nombre.
    tagline: "Todo lo que hago, en un solo lugar.",

    // Foto de perfil.
    // - Dejalo en null para mostrar el monograma "MV" como placeholder.
    // - Cuando tengas la foto, ponela en public/assets/avatar.jpg (o .png/.webp)
    //   y cambiá esta línea a: avatar: "/assets/avatar.jpg"
    avatar: null,
  },

  // Links que se muestran, en orden. Agregá, borrá o reordená lo que quieras.
  // "label" = nombre de la red. "handle" = lo que se ve grande. "url" = adónde va.
  links: [
    {
      label: "Instagram",
      handle: "@massimoveneziaa",
      url: "https://instagram.com/massimoveneziaa",
    },
    {
      label: "X",
      handle: "@massimovenezia",
      url: "https://x.com/massimovenezia",
    },
    {
      label: "TikTok",
      handle: "@massimovenezia",
      url: "https://tiktok.com/@massimovenezia",
    },
    {
      label: "YouTube",
      handle: "@massimo_venezia",
      url: "https://www.youtube.com/@massimo_venezia",
    },
  ],

  // Texto del pie de página. Podés dejarlo vacío: "".
  footer: `© ${new Date().getFullYear()} Massimo Venezia`,
};
