(function () {
  const cfg = window.SITE_CONFIG;
  const icons = window.SITE_ICONS;
  const $ = (sel) => document.querySelector(sel);

  $(".name").textContent = cfg.profile.name;
  $("footer").textContent = cfg.footer;
  document.title = cfg.profile.name;

  // photo: real photo if provided, otherwise a placeholder with initials
  const photoEl = $(".photo");
  if (cfg.profile.photo) {
    const img = document.createElement("img");
    img.src = cfg.profile.photo;
    img.alt = cfg.profile.name;
    photoEl.appendChild(img);
  } else {
    photoEl.classList.add("placeholder");
    const initials = document.createElement("span");
    initials.className = "initials";
    initials.textContent = cfg.profile.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    photoEl.appendChild(initials);
  }

  // link icons
  // Sin target="_blank": en mobile, el tap tiene que ser una navegación de
  // primer nivel para que el SO pueda abrir la app vía Universal/App Link.
  const list = $(".links");
  cfg.links.forEach((link) => {
    const li = document.createElement("li");
    const path = icons[link.icon] || "";
    li.innerHTML = `
      <a href="${link.url}" data-icon="${link.icon}" aria-label="${link.label}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>
      </a>`;
    list.appendChild(li);
  });

  if (window.DEEPLINKS) {
    window.DEEPLINKS.wireDeepLinks(list);
    // En desktop no hay app que abrir: mejor dejar que abra en pestaña nueva.
    if (!window.DEEPLINKS.isMobile) {
      list.querySelectorAll("a").forEach((a) => {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      });
    }
  }
})();
