const screen = document.getElementById("screen");
const FAV_KEY = "belmonte_favs";
const APP_KEY = "belmonte_custom_apps";
const START_KEY = "belmonte_start";

const MENU = [
  { id: "home", label: "Home",      icon: "icons/home.png" },
  { id: "live", label: "Live TV",   icon: "icons/live.png" },
  { id: "apps", label: "Apps",      icon: "icons/apps.png" },
  { id: "web",  label: "Browser",   icon: "icons/browser.png" },
  { id: "fav",  label: "Favorites", icon: "icons/star.png" },
  { id: "set",  label: "Settings",  icon: "icons/settings.png" }
];

const APPS = [
  { name: "YouTube",  url: "https://www.youtube.com",   icon: "icons/youtube.png" },
  { name: "Pluto TV", url: "https://pluto.tv",          icon: "icons/pluto.png" },
  { name: "Twitch",   url: "https://www.twitch.tv",     icon: "icons/twitch.png" },
  { name: "Music",    url: "https://music.youtube.com", icon: "icons/music.png" },
  { name: "Kosmi",    url: "https://kosmi.io",          icon: "icons/kosmi.png" },
  { name: "Tubi",     url: "https://tubitv.com",        icon: "icons/tubi.png" }
];

const LIVE = [
  { name: "Pluto TV", url: "https://pluto.tv",      icon: "icons/pluto.png" },
  { name: "Tubi",     url: "https://tubitv.com",    icon: "icons/tubi.png" },
  { name: "Twitch",   url: "https://www.twitch.tv", icon: "icons/twitch.png" }
];

let page = getStart();
let picking = false;
let removing = false;
let addingApp = false;
let iconFor = "";

Render();

function getStart()
{
  const value = localStorage.getItem(START_KEY);
  return (value === "live" || value === "apps" || value === "home") ? value : "home";
}

function setStart(id)
{
  localStorage.setItem(START_KEY, id);
  page = "set";
  Render();
}

function readList(key)
{
  try
  {
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(list) ? list : [];
  }
  catch (e)
  {
    return [];
  }
}

function loadFavs(){ return readList(FAV_KEY); }
function saveFavs(list){ localStorage.setItem(FAV_KEY, JSON.stringify(list)); }
function loadCustom(){ return readList(APP_KEY); }
function saveCustom(list){ localStorage.setItem(APP_KEY, JSON.stringify(list)); }
function allApps(){ return APPS.concat(loadCustom()); }
function isFav(url){ return loadFavs().some(item => item.url === url); }

function normalizeIcon(value)
{
  let icon = (value || "").trim();
  if (!icon) return "icons/browser.png";
  if (icon.indexOf("/") === -1) icon = "icons/" + icon;
  if (!/\.(png|jpg|jpeg|webp|svg)$/i.test(icon)) icon += ".png";
  return icon;
}

function addFav(url)
{
  const app = allApps().find(item => item.url === url);
  if (!app || isFav(url)) return;
  saveFavs(loadFavs().concat([app]));
  picking = false;
  page = "fav";
  Render();
}

function removeFav(url)
{
  saveFavs(loadFavs().filter(item => item.url !== url));
  Render();
}

function clearFavs()
{
  saveFavs([]);
  picking = false;
  removing = false;
  page = "fav";
  Render();
}

function addCustomApp()
{
  const name = ((document.getElementById("app-name") || {}).value || "").trim();
  const url  = ((document.getElementById("app-url")  || {}).value || "").trim();
  const icon = normalizeIcon((document.getElementById("app-icon") || {}).value || "");
  if (!name || !/^https?:\/\//i.test(url)) return;
  if (allApps().some(item => item.url === url)) return;

  saveCustom(loadCustom().concat([{ name, url, icon, custom: true }]));
  addingApp = false;
  page = "apps";
  Render();
}

function saveCustomIcon()
{
  const icon = normalizeIcon((document.getElementById("app-icon") || {}).value || "");
  const list = loadCustom().map(app => {
    if (app.url === iconFor) app.icon = icon;
    return app;
  });
  saveCustom(list);

  const favs = loadFavs().map(app => {
    if (app.url === iconFor) app.icon = icon;
    return app;
  });
  saveFavs(favs);

  iconFor = "";
  page = "set";
  Render();
}

function removeCustomApp(url)
{
  saveCustom(loadCustom().filter(item => item.url !== url));
  saveFavs(loadFavs().filter(item => item.url !== url));
  Render();
}

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
      <div class="brand">Belmonte <b>TV</b></div>
      <nav class="nav">
        ${MENU.map(item => `
          <div class="nav-item ${page === item.id ? "active" : ""}"
               onclick="Go('${item.id}')">
            ${iconTag(item.icon, item.label)}
            <span>${item.label}</span>
          </div>
        `).join("")}
      </nav>
    </aside>
    <div class="stage">
      <div class="topbar">
        <div class="datetime">
          <div class="time" id="clock">00:00</div>
          <div class="date" id="date"></div>
        </div>
      </div>
      <section class="main" id="main"></section>
    </div>
  `;
  DrawPage();
  UpdateClock();
}

function Go(id)
{
  picking = false;
  removing = false;
  addingApp = false;
  iconFor = "";
  if (id === "web") return OpenURL("https://www.google.com");
  page = id;
  Render();
}

function DrawPage()
{
  const main = document.getElementById("main");
  const favs = loadFavs();
  const custom = loadCustom();
  const apps = allApps();
  const start = getStart();

  if (page === "home")
  {
    const row = favs.length ? favs.slice(0, 4) : apps.slice(0, 4);
    main.innerHTML = `
      <h1>Home</h1>
      <div class="featured" onclick="OpenURL('https://pluto.tv')">
        <div class="tag">Live TV</div>
        <h2>Pluto TV</h2>
        <div class="watch">Watch live</div>
      </div>
      <div class="section-title">${favs.length ? "Favorites" : "Suggested"}</div>
      <div class="grid">${row.map(app => AppTile(app, "open")).join("")}</div>
    `;
    return;
  }

  if (page === "live")
  {
    main.innerHTML = `
      <h1>Live TV</h1>
      <div class="featured" onclick="OpenURL('https://pluto.tv')">
        <div class="tag">Now available</div>
        <h2>Pluto TV</h2>
        <div class="watch">Watch live</div>
      </div>
      <div class="grid">${LIVE.map(app => AppTile(app, "open")).join("")}</div>
    `;
    return;
  }

  if (page === "apps")
  {
    main.innerHTML = `
      <h1>Apps</h1>
      <div class="grid">${apps.map(app => AppTile(app, "open")).join("")}</div>
    `;
    return;
  }

  if (page === "fav")
  {
    if (picking)
    {
      main.innerHTML = `
        <h1>Add favorite</h1>
        <div class="actions">
          <button class="btn" onclick="picking=false; Render()">Cancel</button>
        </div>
        <div class="grid">
          ${apps.map(app => AppTile(app, isFav(app.url) ? "disabled" : "add")).join("")}
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <h1>Favorites</h1>
      <div class="actions">
        <button class="btn" onclick="picking=true; removing=false; Render()">Add favorite</button>
        ${favs.length ? `<button class="btn" onclick="removing=${!removing}; Render()">${removing ? "Done" : "Remove"}</button>` : ""}
        ${favs.length ? `<button class="btn" onclick="clearFavs()">Clear all</button>` : ""}
      </div>
      ${
        favs.length
          ? `<div class="grid">${favs.map(app => AppTile(app, removing ? "remove" : "open")).join("")}</div>`
          : `<div class="empty">No favorites yet.</div>`
      }
    `;
    return;
  }

  if (page === "set")
  {
    if (addingApp || iconFor)
    {
      const title = iconFor ? "Set icon" : "Add app";
      main.innerHTML = `
        <h1>${title}</h1>
        <div class="form">
          ${iconFor ? "" : `<input id="app-name" type="text" placeholder="App name">`}
          ${iconFor ? "" : `<input id="app-url" type="text" placeholder="https://example.com">`}
          <input id="app-icon" type="text" placeholder="icon file  e.g. reddit.png">
          <div class="actions">
            <button class="btn" onclick="${iconFor ? "saveCustomIcon()" : "addCustomApp()"}">Save</button>
            <button class="btn" onclick="addingApp=false; iconFor=''; Render()">Cancel</button>
          </div>
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <h1>Settings</h1>
      <div class="section-title">Start page</div>
      <div class="settings-list">
        <div class="row" onclick="setStart('home')">Home${start === "home" ? "  ·  selected" : ""}</div>
        <div class="row" onclick="setStart('live')">Live TV${start === "live" ? "  ·  selected" : ""}</div>
        <div class="row" onclick="setStart('apps')">Apps${start === "apps" ? "  ·  selected" : ""}</div>
      </div>
      <div class="section-title">System</div>
      <div class="settings-list">
        <div class="row" onclick="addingApp=true; Render()">Add app</div>
        <div class="row" onclick="location.reload()">Reload interface</div>
        <div class="row" onclick="clearFavs()">Clear favorites</div>
        <div class="row" onclick="OpenURL('https://github.com/belmonte-labs/belmonte-os')">Open GitHub</div>
        <div class="row static">Version 2.9</div>
      </div>
      ${
        custom.length
          ? `<div class="section-title">Custom apps</div>
             <div class="settings-list">
               ${custom.map(app => `
                 <div class="row" onclick="iconFor='${app.url}'; Render()">Set icon · ${app.name}</div>
                 <div class="row" onclick="removeCustomApp('${app.url}')">Remove ${app.name}</div>
               `).join("")}
             </div>`
          : ""
      }
    `;
  }
}

function AppTile(app, mode)
{
  if (mode === "disabled")
  {
    return `
      <div class="tile disabled">
        ${iconTag(app.icon, app.name)}
        <label>${app.name}</label>
      </div>
    `;
  }
  const click =
    mode === "add"    ? `addFav('${app.url}')` :
    mode === "remove" ? `removeFav('${app.url}')` :
                        `OpenURL('${app.url}')`;
  return `
    <div class="tile" onclick="${click}">
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
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");
  if (!clock || !date) return;
  const tick = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    date.textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };
  tick();
  if (window.ClockTimer) clearInterval(window.ClockTimer);
  window.ClockTimer = setInterval(tick, 1000);
}
