const screen = document.getElementById("screen");

const MENU = [
  { id: "live",  label: "Live TV",    icon: "icons/live.png" },
  { id: "apps",  label: "Apps",       icon: "icons/apps.png" },
  { id: "fav",   label: "Favorites",  icon: "icons/star.png" },
  { id: "set",   label: "Settings",   icon: "icons/settings.png" }
];

const APPS = [
  { name: "YouTube",  url: "https://www.youtube.com",     icon: "icons/youtube.png" },
  { name: "Pluto TV", url: "https://pluto.tv",            icon: "icons/pluto.png" },
  { name: "Twitch",   url: "https://www.twitch.tv",       icon: "icons/twitch.png" },
  { name: "Browser",  url: "https://www.google.com",      icon: "icons/browser.png" },
  { name: "Music",    url: "https://music.youtube.com",   icon: "icons/music.png" },
  { name: "Kosmi",    url: "https://kosmi.io",            icon: "icons/kosmi.png" },
  { name: "Tubi",     url: "https://tubitv.com",          icon: "icons/tubi.png" }
];

let page = "apps";

Render();

function iconTag(src, name)
{
  const letter = (name || "?").charAt(0).toUpperCase();
  return `
    <img src="${src}" alt="${name}"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <div class="fallback" style="display:none">${letter}</div>
  `;
}

function Render()
{
  screen.innerHTML = `
    <aside class="sidebar">
      <div class="brand">BELMONTE</div>
      <nav class="nav">
        ${MENU.map(item => `
          <div class="nav-item ${page === item.id ? "active" : ""}"
               onclick="Go('${item.id}')">
            ${iconTag(item.icon, item.label)}
            <span>${item.label}</span>
          </div>
        `).join("")}
      </nav>
      <div class="clock" id="clock">00:00</div>
    </aside>
    <section class="main" id="main"></section>
  `;

  DrawPage();
  UpdateClock();
}

function Go(id)
{
  if (id === "live")
  {
    OpenURL("https://pluto.tv");
    return;
  }
  page = id;
  Render();
}

function DrawPage()
{
  const main = document.getElementById("main");

  if (page === "apps")
  {
    main.innerHTML = `
      <h1>Apps</h1>
      <div class="sub">Escolha um aplicativo</div>
      <div class="grid">
        ${APPS.map(app => AppTile(app)).join("")}
      </div>
    `;
    return;
  }

  if (page === "fav")
  {
    const favs = APPS.slice(0, 4);
    main.innerHTML = `
      <h1>Favorites</h1>
      <div class="sub">Atalhos rápidos</div>
      <div class="grid">
        ${favs.map(app => AppTile(app)).join("")}
      </div>
    `;
    return;
  }

  if (page === "set")
  {
    main.innerHTML = `
      <h1>Settings</h1>
      <div class="sub">Belmonte OS · Belmonte Labs</div>
      <div class="settings-list">
        <div class="row" onclick="location.reload()">Reload interface</div>
        <div class="row" onclick="OpenURL('https://github.com/belmonte-labs/belmonte-os')">GitHub</div>
        <div class="row">Version 2.1</div>
      </div>
    `;
  }
}

function AppTile(app)
{
  return `
    <div class="tile" onclick="OpenURL('${app.url}')">
      ${iconTag(app.icon, app.name)}
      <label>${app.name}</label>
    </div>
  `;
}

function OpenURL(url)
{
  window.location.href = url;
}

function UpdateClock()
{
  const el = document.getElementById("clock");
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  tick();
  if (window.ClockTimer) clearInterval(window.ClockTimer);
  window.ClockTimer = setInterval(tick, 1000);
}
