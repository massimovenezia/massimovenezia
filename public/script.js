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
  const list = $(".links");
  cfg.links.forEach((link) => {
    const li = document.createElement("li");
    const path = icons[link.icon] || "";
    li.innerHTML = `
      <a href="${link.url}" data-icon="${link.icon}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>
      </a>`;
    list.appendChild(li);
  });

  if (window.DEEPLINKS) {
    window.DEEPLINKS.wireDeepLinks(list);
    window.DEEPLINKS.showInAppBannerIfNeeded();
  }
})();
