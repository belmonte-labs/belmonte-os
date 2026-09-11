const screen = document.getElementById("screen");

const ICONS = {
  youtube: `<svg viewBox="0 0 24 24" fill="none"><rect x="1" y="5" width="22" height="14" rx="4" fill="#FF0000"/><path d="M10 9.2v5.6l5.2-2.8L10 9.2z" fill="#fff"/></svg>`,
  pluto: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FFF200"/><path d="M8 16V8h3.2c2.3 0 3.6 1.2 3.6 3.1S13.5 14.2 11.2 14.2H10V16H8zm2-4.2h1c.9 0 1.5-.5 1.5-1.1S12 9.6 11.1 9.6H10v2.2z" fill="#111"/></svg>`,
  twitch: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 3h14v10.2l-3.2 3.3h-3.3L10.2 19H8.4v-2.5H5V3z" fill="#9146FF"/><path d="M7.2 5.2v8.7h3.1V16l2.3-2.1h3.5l1.7-1.7V5.2H7.2z" fill="#fff"/><path d="M13.1 7.3h1.6v3.7h-1.6V7.3zm-3.3 0H11.4v3.7H9.8V7.3z" fill="#9146FF"/></svg>`,
  browser: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#1a73e8"/><path d="M12 3c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z" stroke="#8ab4f8" stroke-width="1.4"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="#fff" stroke-width="1.2"/><path d="M3.4 12h17.2M5 8h14M5 16h14" stroke="#fff" stroke-width="1.2"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FF0033"/><path d="M11 7.5v6.3a2.6 2.6 0 1 0 1.6 2.4V10l4-.8V8l-5.6 1.1z" fill="#fff"/></svg>`,
  kosmi: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" fill="#12b3c9"/><circle cx="9" cy="12" r="2" fill="#fff"/><circle cx="15" cy="12" r="2" fill="#fff"/><path d="M9 14.2c.8.8 2.2.8 3 0s2.2-.8 3 0" stroke="#08343a" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  fav: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.7 6.9 19.3l1-5.7-4.1-4 5.7-.8L12 3.6z" fill="#f5c542"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.1" fill="#d7e3f4"/><path d="M19.2 12.8l1.6.9-1.5 2.6-1.8-.3a6.9 6.9 0 0 1-1.5.9l-.3 1.8h-3l-.3-1.8a6.9 6.9 0 0 1-1.5-.9l-1.8.3L3.2 13.7l1.6-.9a7 7 0 0 1 0-1.8L3.2 10.1l1.5-2.6 1.8.3a6.9 6.9 0 0 1 1.5-.9l.3-1.8h3l.3 1.8a6.9 6.9 0 0 1 1.5.9l1.8-.3 1.5 2.6-1.6.9a7 7 0 0 1 0 1.8z" stroke="#d7e3f4" stroke-width="1.4"/></svg>`
};

const Apps = [
  { name: "YouTube",  command: "OPEN_YOUTUBE",  cls: "youtube",  icon: "youtube" },
  { name: "Pluto TV", command: "OPEN_PLUTO",    cls: "pluto",    icon: "pluto" },
  { name: "Twitch",   command: "OPEN_TWITCH",   cls: "twitch",   icon: "twitch" },
  { name: "Browser",  command: "OPEN_BROWSER",  cls: "browser",  icon: "browser" },
  { name: "Music",    command: "OPEN_MUSIC",    cls: "music",    icon: "music" },
  { name: "Kosmi",    command: "OPEN_KOSMI",    cls: "kosmi",    icon: "kosmi" },
  { name: "Favorites",command: "OPEN_FAVORITES",cls: "fav",      icon: "fav" },
  { name: "Settings", command: "OPEN_SETTINGS", cls: "settings", icon: "settings" }
];

const Favorites = [
  { name: "YouTube", url: "https://www.youtube.com", icon: "youtube", cls: "youtube" },
  { name: "Pluto TV", url: "https://pluto.tv", icon: "pluto", cls: "pluto" },
  { name: "Twitch", url: "https://www.twitch.tv", icon: "twitch", cls: "twitch" },
  { name: "Google", url: "https://www.google.com", icon: "browser", cls: "browser" },
  { name: "YT Music", url: "https://music.youtube.com", icon: "music", cls: "music" },
  { name: "Kosmi", url: "https://kosmi.io", icon: "kosmi", cls: "kosmi" }
];

Boot();

function tile(item, onclick)
{
  return `
    <div class="app ${item.cls || ""}" onclick="${onclick}">
      <div class="logo">${ICONS[item.icon]}</div>
      <div class="label">${item.name}</div>
    </div>
  `;
}

function chrome(title, extra)
{
  return `
    <div class="topbar">
      <div class="brand"><span class="brand-mark"></span>BELMONTE OS</div>
      <div class="status">
        <span>${title}</span>
        <b id="clock">00:00</b>
      </div>
    </div>
    ${extra || ""}
  `;
}

function Boot()
{
  screen.innerHTML = `
    <div class="boot">
      <div class="boot-logo"></div>
      <h1>BELMONTE</h1>
      <h2>OS</h2>
      <div class="boot-bar"><span></span></div>
      <small>STARTING SYSTEM</small>
    </div>
  `;
  setTimeout(Home, 2300);
}

function Home()
{
  screen.innerHTML = `
    ${chrome("Connected")}
    <div class="hero">
      <h2>O que você quer assistir?</h2>
      <p>Belmonte Labs · Smart TV</p>
    </div>
    <div class="content">
      <div class="app-grid">
        ${Apps.map(app => tile(app, `OpenApp('${app.command}')`)).join("")}
      </div>
    </div>
  `;
  UpdateClock();
}

function UpdateClock()
{
  const clock = document.getElementById("clock");
  if (!clock) return;
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  tick();
  if (window.ClockTimer) clearInterval(window.ClockTimer);
  window.ClockTimer = setInterval(tick, 1000);
}

function OpenApp(command)
{
  const map = {
    OPEN_YOUTUBE: "https://www.youtube.com",
    OPEN_PLUTO: "https://pluto.tv",
    OPEN_TWITCH: "https://www.twitch.tv",
    OPEN_BROWSER: "https://www.google.com",
    OPEN_MUSIC: "https://music.youtube.com",
    OPEN_KOSMI: "https://kosmi.io"
  };

  if (command === "OPEN_FAVORITES") return ShowFavorites();
  if (command === "OPEN_SETTINGS") return ShowSettings();
  if (map[command]) OpenURL(map[command]);
}

function OpenURL(url)
{
  screen.innerHTML = `
    <div class="boot">
      <div class="boot-logo"></div>
      <h1>BELMONTE</h1>
      <h2>LOADING</h2>
      <div class="boot-bar"><span></span></div>
    </div>
  `;
  setTimeout(() => { window.location.href = url; }, 700);
}

function ShowFavorites()
{
  screen.innerHTML = `
    ${chrome("Favorites")}
    <div class="page-head">
      <h2>Favorites</h2>
      <div class="back" onclick="Home()">‹ Home</div>
    </div>
    <div class="content">
      <div class="app-grid">
        ${Favorites.map(item => tile(item, `OpenURL('${item.url}')`)).join("")}
      </div>
    </div>
  `;
  UpdateClock();
}

function ShowSettings()
{
  const items = [
    { name: "Reboot", cls: "settings", icon: "settings", click: "RunSetting('REBOOT')" },
    { name: "Home", cls: "fav", icon: "fav", click: "RunSetting('HOME')" },
    { name: "GitHub", cls: "browser", icon: "browser", click: "RunSetting('GITHUB')" },
    { name: "About", cls: "kosmi", icon: "kosmi", click: "RunSetting('ABOUT')" }
  ];

  screen.innerHTML = `
    ${chrome("Settings")}
    <div class="page-head">
      <h2>Settings</h2>
      <div class="back" onclick="Home()">‹ Home</div>
    </div>
    <div class="content">
      <div class="app-grid">
        ${items.map(item => tile(item, item.click)).join("")}
      </div>
    </div>
  `;
  UpdateClock();
}

function RunSetting(action)
{
  if (action === "REBOOT") return location.reload();
  if (action === "HOME") return Home();
  if (action === "GITHUB") return OpenURL("https://github.com/belmonte-labs/belmonte-os");
  if (action === "ABOUT")
  {
    screen.innerHTML = `
      ${chrome("About")}
      <div class="page-head">
        <h2>About</h2>
        <div class="back" onclick="ShowSettings()">‹ Settings</div>
      </div>
      <div class="about">
        <h2>BELMONTE OS</h2>
        <p>Version 2.0</p>
        <p>Designed by Belmonte Labs</p>
        <p>Powered by HTML, CSS, JavaScript & Second Life</p>
      </div>
    `;
    UpdateClock();
  }
}
