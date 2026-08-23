(function () {
  const cfg = window.SITE_CONFIG;
  const icons = window.SITE_ICONS;
  const $ = (sel) => document.querySelector(sel);

  $(".name").textContent = cfg.profile.name;
  $("footer").textContent = cfg.footer;
  document.title = cfg.profile.name;

  // avatar: real photo if provided, otherwise initials monogram
  const avatarEl = $(".avatar");
  if (cfg.profile.avatar) {
    const img = document.createElement("img");
    img.src = cfg.profile.avatar;
    img.alt = cfg.profile.name;
    avatarEl.appendChild(img);
  } else {
    const initials = document.createElement("span");
    initials.className = "initials";
    initials.textContent = cfg.profile.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    avatarEl.appendChild(initials);
  }

  // link icons
  const list = $(".links");
  cfg.links.forEach((link) => {
    const li = document.createElement("li");
    const path = icons[link.icon] || "";
    li.innerHTML = `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>
      </a>`;
    list.appendChild(li);
  });
})();
