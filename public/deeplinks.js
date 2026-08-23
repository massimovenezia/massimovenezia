/**
 * Intenta abrir la app nativa (Instagram, X, YouTube) en vez del sitio web
 * cuando se toca un ícono desde el celular, con fallback automático a la
 * versión web si la app no abre.
 *
 * Importante: los navegadores internos de Instagram, TikTok, Facebook, etc.
 * (el que se abre cuando tocás un link "en la bio") a veces bloquean a
 * propósito la apertura de OTRAS apps para no dejarte ir. Eso no se puede
 * evitar del todo con código — por eso además mostramos un aviso sugiriendo
 * abrir el link en el navegador real (Safari/Chrome) cuando detectamos que
 * estás dentro de uno de esos navegadores.
 */
(function () {
  const ua = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

  const IN_APP_BROWSERS = [
    { test: /Instagram/i, name: "Instagram" },
    { test: /FBAN|FBAV|FB_IAB/i, name: "Facebook" },
    { test: /Messenger/i, name: "Messenger" },
    { test: /Line\//i, name: "LINE" },
    { test: /MicroMessenger/i, name: "WeChat" },
    { test: /BytedanceWebview|musical_ly|TikTok/i, name: "TikTok" },
  ];

  function detectInAppBrowser() {
    return IN_APP_BROWSERS.find((b) => b.test.test(ua)) || null;
  }

  // Solo Instagram, X y YouTube tienen esquemas de app confiables.
  // TikTok no tiene uno público estable: se deja que abra la web (que a
  // veces igual redirige sola a la app vía Universal/App Links del SO).
  function buildAppUrl(icon, url) {
    try {
      const u = new URL(url);
      const username = u.pathname.replace(/^\//, "");
      switch (icon) {
        case "instagram":
          return `instagram://user?username=${encodeURIComponent(username)}`;
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

  function showInAppBannerIfNeeded() {
    if (!isMobile) return;
    const app = detectInAppBrowser();
    if (!app) return;

    try {
      if (sessionStorage.getItem("hideInAppBanner")) return;
    } catch {
      /* sessionStorage no disponible: mostramos el aviso igual */
    }

    const bar = document.createElement("div");
    bar.className = "inapp-banner";
    bar.innerHTML = `
      <span>Estás en el navegador de ${app.name}. Para que los links abran las apps, tocá ⋯ y elegí "Abrir en el navegador".</span>
      <button type="button" aria-label="Cerrar aviso">×</button>
    `;
    bar.querySelector("button").addEventListener("click", () => {
      bar.remove();
      try {
        sessionStorage.setItem("hideInAppBanner", "1");
      } catch {
        /* no-op */
      }
    });
    document.body.prepend(bar);
  }

  window.DEEPLINKS = { wireDeepLinks, showInAppBannerIfNeeded };
})();
