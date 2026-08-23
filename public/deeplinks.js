/**
 * En mobile, intenta abrir la app nativa en vez del sitio web al tocar un
 * ícono. Solo para las apps que tienen un esquema de URL propio confiable
 * (X, YouTube) — se intenta ese esquema primero y, si no responde, cae al
 * sitio web.
 *
 * Instagram y TikTok no tienen un esquema propio confiable: para esas se
 * deja el link normal (sin target="_blank"), así el tap queda como una
 * navegación real de primer nivel y el sistema operativo puede resolver su
 * propio Universal Link / App Link a la app si la tiene instalada. Forzar
 * un esquema ahí rompe esa cadena y termina abriendo la web en vez de la
 * app — por eso no se intenta.
 */
(function () {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  function buildAppUrl(icon, url) {
    try {
      const u = new URL(url);
      const username = u.pathname.replace(/^\//, "");
      switch (icon) {
        case "x":
          return `twitter://user?screen_name=${encodeURIComponent(username)}`;
        case "youtube":
          return `vnd.youtube://${u.host}${u.pathname}`;
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  function openWithFallback(appUrl, webUrl) {
    let hidden = false;
    const onHide = () => {
      hidden = true;
    };
    document.addEventListener("visibilitychange", onHide, { once: true });
    window.location.href = appUrl;
    setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      if (!hidden) window.location.href = webUrl;
    }, 1200);
  }

  function wireDeepLinks(container) {
    if (!isMobile) return;
    container.querySelectorAll("a[data-icon]").forEach((a) => {
      const appUrl = buildAppUrl(a.dataset.icon, a.href);
      if (!appUrl) return;
      const webUrl = a.href;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openWithFallback(appUrl, webUrl);
      });
    });
  }

  // El HTML ya viene con los links armados (renderizados por el Worker),
  // así que esto corre directo: no hace falta esperar a que JS construya
  // nada primero.
  const list = document.querySelector(".links");
  if (list) {
    wireDeepLinks(list);
    // En desktop no hay app que abrir: mejor dejar que abra en pestaña nueva.
    if (!isMobile) {
      list.querySelectorAll("a").forEach((a) => {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      });
    }
  }
})();
