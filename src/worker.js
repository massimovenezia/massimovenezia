/**
 * Sirve los archivos estáticos de /public y, si es HTML, reescribe el
 * <meta name="description"> (y og:description) al idioma que corresponda
 * según el país del visitante (dato que Cloudflare ya resuelve en el edge).
 *
 * Nota: esto cambia lo que ve una persona real al abrir el sitio. Los
 * buscadores (Google, etc.) rastrean desde su propia ubicación fija, así
 * que el snippet que indexan queda en un solo idioma — no varía por
 * usuario de búsqueda.
 */
const SPANISH_SPEAKING_COUNTRIES = new Set([
  "AR", "MX", "ES", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "GQ", "PR",
]);

const COPY = {
  es: {
    description: "Sitio oficial de Massimo Venezia.",
  },
  en: {
    description: "Official site of Massimo Venezia.",
  },
};

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    const country = request.cf && request.cf.country;
    const lang = SPANISH_SPEAKING_COUNTRIES.has(country) ? "es" : "en";
    const copy = COPY[lang];

    return new HTMLRewriter()
      .on("html", {
        element(el) {
          el.setAttribute("lang", lang);
        },
      })
      .on('meta[name="description"]', {
        element(el) {
          el.setAttribute("content", copy.description);
        },
      })
      .on('meta[property="og:description"]', {
        element(el) {
          el.setAttribute("content", copy.description);
        },
      })
      .transform(response);
  },
};
