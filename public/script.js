(function () {
  const cfg = window.SITE_CONFIG;
  const $ = (sel) => document.querySelector(sel);

  // eyebrow / name / tagline
  $(".eyebrow").textContent = cfg.profile.eyebrow;
  $(".name .first").textContent = cfg.profile.firstName;
  $(".name .last").textContent = cfg.profile.lastName;
  $(".tagline").textContent = cfg.profile.tagline;
  $("footer").textContent = cfg.footer;
  document.title = `${cfg.profile.firstName} ${cfg.profile.lastName}`;

  // avatar: real photo if provided, otherwise initials monogram
  const avatarEl = $(".avatar");
  if (cfg.profile.avatar) {
    const img = document.createElement("img");
    img.src = cfg.profile.avatar;
    img.alt = `${cfg.profile.firstName} ${cfg.profile.lastName}`;
    avatarEl.appendChild(img);
  } else {
    const initials = document.createElement("span");
    initials.className = "initials";
    initials.textContent = `${cfg.profile.firstName[0]}${cfg.profile.lastName[0]}`;
    avatarEl.appendChild(initials);
  }

  // links
  const list = $(".links");
  cfg.links.forEach((link, i) => {
    const li = document.createElement("li");
    li.className = "link-row reveal";
    li.style.setProperty("--delay", `${0.55 + i * 0.09}s`);

    const num = String(i + 1).padStart(2, "0");
    li.innerHTML = `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer">
        <span class="index">${num}</span>
        <span class="text">
          <span class="label">${link.label}</span>
          <span class="handle">${link.handle}</span>
        </span>
        <svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>`;
    list.appendChild(li);
  });

  // stagger the footer in after the last link
  $("footer").style.setProperty(
    "--delay",
    `${0.55 + cfg.links.length * 0.09 + 0.1}s`
  );
})();
