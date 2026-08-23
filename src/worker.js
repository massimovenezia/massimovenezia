import content from "../public/content.json";
import icons from "../public/icons.json";

/**
 * Sirve los archivos estáticos de /public. Para las páginas HTML, además:
 *  1. Renderiza el nombre, la foto y los links directamente en el HTML
 *     (en vez de dejar que los arme JavaScript en el navegador). Esto es
 *     clave para SEO/GEO: la mayoría de los crawlers de IA (GPTBot,
 *     ClaudeBot, PerplexityBot, etc.) NO ejecutan JavaScript, así que si el
 *     contenido solo existiera vía JS, esos bots verían una página vacía.
 *  2. Inyecta datos estructurados (schema.org/Person, con las redes como
 *     "sameAs") para que buscadores y motores de IA puedan asociar
 *     directamente el nombre con cada cuenta.
 *  3. Reescribe la descripción (es/en) según el país del visitante — ver
 *     nota más abajo sobre los límites de esto para SEO.
 *
 * Todo sale de public/content.json y public/icons.json — es lo único que
 * hay que editar para cambiar nombre, foto, links o agregar una red nueva.
 */
const SPANISH_SPEAKING_COUNTRIES = new Set([
  "AR", "MX", "ES", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "GQ", "PR",
]);

const COPY = {
  es: { description: "Sitio oficial de Massimo Venezia." },
  en: { description: "Official site of Massimo Venezia." },
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderPhoto() {
  if (content.profile.photo) {
    return `<img src="${escapeHtml(content.profile.photo)}" alt="${escapeHtml(content.profile.name)}" />`;
  }
  return `<span class="initials">${escapeHtml(initials(content.profile.name))}</span>`;
}

function renderLinks() {
  return content.links
    .map((link) => {
      const path = icons[link.icon] || "";
      return `<li><a href="${escapeHtml(link.url)}" data-icon="${escapeHtml(link.icon)}" aria-label="${escapeHtml(link.label)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg></a></li>`;
    })
    .join("");
}

function renderJsonLd(canonicalUrl) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.profile.name,
    url: canonicalUrl,
    sameAs: content.links.map((l) => l.url),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    const country = request.cf && request.cf.country;
    const lang = SPANISH_SPEAKING_COUNTRIES.has(country) ? "es" : "en";
    const copy = COPY[lang];
    const footerText = content.footer.replace("{year}", new Date().getFullYear());
    const canonicalUrl = `${new URL(request.url).origin}/`;

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
      .on(".photo", {
        element(el) {
          el.setInnerContent(renderPhoto(), { html: true });
          if (!content.profile.photo) {
            el.setAttribute("class", `${el.getAttribute("class") || "photo"} placeholder`);
          }
        },
      })
      .on("h1.name", {
        element(el) {
          el.setInnerContent(content.profile.name);
        },
      })
      .on("ul.links", {
        element(el) {
          el.setInnerContent(renderLinks(), { html: true });
        },
      })
      .on("footer", {
        element(el) {
          el.setInnerContent(footerText);
        },
      })
      .on("head", {
        element(el) {
          el.append(renderJsonLd(canonicalUrl), { html: true });
        },
      })
      .transform(response);
  },
};
