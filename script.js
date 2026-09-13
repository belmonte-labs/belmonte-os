const screen = document.getElementById("screen");
const FAV_KEY = "belmonte_favs";
const APP_KEY = "belmonte_custom_apps";
const START_KEY = "belmonte_start";
const TZ_KEY = "belmonte_tz";
const SCREEN_KEY = "belmonte_saver";
const THEME_KEY = "belmonte_theme";
const WALL_KEY = "belmonte_wall";
const WALL_FILE_KEY = "belmonte_wall_file";

const SAVER_OPTS = [
  { id: "off", label: "Off",         ms: 0 },
  { id: "30",  label: "30 seconds",  ms: 30000 },
  { id: "60",  label: "1 minute",    ms: 60000 },
  { id: "90",  label: "90 seconds",  ms: 90000 },
  { id: "120", label: "2 minutes",   ms: 120000 },
  { id: "300", label: "5 minutes",   ms: 300000 },
  { id: "600", label: "10 minutes",  ms: 600000 }
];

const THEMES = [
  { id: "midnight", label: "Midnight" },
  { id: "graphite", label: "Graphite" },
  { id: "warm",     label: "Warm" },
  { id: "oled",     label: "OLED" }
];

const ZONES = [
  { id: "America/New_York",    city: "New York" },
  { id: "America/Los_Angeles", city: "Los Angeles" },
  { id: "America/Chicago",     city: "Chicago" },
  { id: "America/Toronto",     city: "Toronto" },
  { id: "America/Sao_Paulo",   city: "Sao Paulo" },
  { id: "America/Mexico_City", city: "Mexico City" },
  { id: "Europe/London",       city: "London" },
  { id: "Europe/Paris",        city: "Paris" },
  { id: "Europe/Berlin",       city: "Berlin" },
  { id: "Asia/Dubai",          city: "Dubai" },
  { id: "Asia/Kolkata",        city: "Mumbai" },
  { id: "Asia/Tokyo",          city: "Tokyo" },
  { id: "Asia/Seoul",          city: "Seoul" },
  { id: "Australia/Sydney",    city: "Sydney" }
];

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

const FEATURED = [
  { name: "Pluto TV", tag: "Live TV", url: "https://pluto.tv",          banner: "pluto" },
  { name: "YouTube",  tag: "Video",   url: "https://www.youtube.com",   banner: "youtube" },
  { name: "Twitch",   tag: "Live",    url: "https://www.twitch.tv",     banner: "twitch" },
  { name: "Tubi",     tag: "Movies",  url: "https://tubitv.com",        banner: "tubi" },
  { name: "Music",    tag: "Audio",   url: "https://music.youtube.com", banner: "music" }
];
function queryVal(name)
{
  const s = location.search || "";
  const m = s.match(new RegExp("[?&]" + name + "=([^&]*)"));
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
}

function applyQueryDefaults()
{
  const tz = queryVal("tz");
  const theme = queryVal("theme");
  const saver = queryVal("saver");
  const start = queryVal("start");
  const wall = queryVal("wall");
  const file = queryVal("file");
  if (tz) localStorage.setItem(TZ_KEY, tz);
  if (theme) localStorage.setItem(THEME_KEY, theme);
  if (saver) localStorage.setItem(SCREEN_KEY, saver);
  if (start) localStorage.setItem(START_KEY, start);
  if (wall === "none") localStorage.setItem(WALL_KEY, "none");
  if (file)
  {
    localStorage.setItem(WALL_KEY, "custom");
    localStorage.setItem(WALL_FILE_KEY, file.indexOf("/") === -1 ? "wallpapers/" + file : file);
  }
}

applyQueryDefaults();

let page = getStart();
let picking = false;
let removing = false;
let addingApp = false;
let iconFor = "";
let choosingTz = false;
let saverOn = false;
let idleTimer = null;
let featIndex = 0;
let featTimer = null;

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
function getTheme()
{
  const id = localStorage.getItem(THEME_KEY) || "midnight";
  return THEMES.some(item => item.id === id) ? id : "midnight";
}
function setTheme(id)
{
  localStorage.setItem(THEME_KEY, id);
  page = "set";
  Render();
}
function getWall()
{
  const id = localStorage.getItem(WALL_KEY) || "none";
  return id === "custom" ? "custom" : "none";
}
function setWall(id)
{
  localStorage.setItem(WALL_KEY, id);
  page = "set";
  Render();
}
function pickWall(file)
{
  localStorage.setItem(WALL_FILE_KEY, "wallpapers/" + file);
  localStorage.setItem(WALL_KEY, "custom");
  page = "set";
  Render();
}
function applyWall()
{
  screen.style.backgroundImage = "";
  if (getWall() !== "custom") return;
  const file = localStorage.getItem(WALL_FILE_KEY);
  if (!file) return;
  screen.style.backgroundImage =
    'linear-gradient(rgba(8,9,12,.62), rgba(8,9,12,.62)), url("' + file + '")';
}
function fillWallBox()
{
  const box = document.getElementById("wall-box");
  if (!box) return;
  fetch("wallpapers/list.json?v=2")
    .then(function (res) { return res.ok ? res.json() : []; })
    .then(function (list)
    {
      if (!list || !list.length) return;
      const current = localStorage.getItem(WALL_FILE_KEY) || "";
      box.innerHTML = `
        <div class="wall-grid">
          ${list.map(function (file)
          {
            const path = "wallpapers/" + file;
            const on = current === path && getWall() === "custom" ? "on" : "";
            return `<div class="wall-pick ${on}" onclick="pickWall('${file}')"><img src="${path}" alt=""></div>`;
          }).join("")}
        </div>
      `;
    })
    .catch(function () {});
}
function getTz()
{
  return localStorage.getItem(TZ_KEY) || "America/New_York";
}
function setTz(id)
{
  localStorage.setItem(TZ_KEY, id);
  choosingTz = false;
  page = "set";
  Render();
}
function tzLabel()
{
  const found = ZONES.find(item => item.id === getTz());
  return found ? found.city : "New York";
}
function getSaver()
{
  const id = localStorage.getItem(SCREEN_KEY) || "90";
  return SAVER_OPTS.find(item => item.id === id) || SAVER_OPTS[3];
}
function setSaver(id)
{
  localStorage.setItem(SCREEN_KEY, id);
  page = "set";
  Render();
}

function nowParts()
{
  const tz = getTz();
  const now = new Date();
  return {
    time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }),
    date: now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: tz })
  };
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

function currentFeat()
{
  return FEATURED[featIndex % FEATURED.length];
}
function paintFeatured()
{
  const el = document.getElementById("featured");
  if (!el) return;
  const item = currentFeat();
  el.onclick = function () { OpenURL(item.url); };
  el.innerHTML = `
    <div class="tag">${item.tag}</div>
    <h2>${item.name}</h2>
    <div class="watch">Watch</div>
  `;
  el.style.backgroundImage = "";
  tryBanner(el, item.banner);
}
function tryBanner(el, slug)
{
  const files = [
    "banners/" + slug + ".jpg",
    "banners/" + slug + ".jpeg",
    "banners/" + slug + ".png"
  ];
  let i = 0;
  function next()
  {
    if (i >= files.length) return;
    const src = files[i++];
    const img = new Image();
    img.onload = function ()
    {
      el.style.backgroundImage =
        'linear-gradient(90deg, rgba(8,9,12,.84) 0%, rgba(8,9,12,.35) 48%, rgba(8,9,12,.10) 100%), url("' + src + '")';
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    };
    img.onerror = next;
    img.src = src;
  }
  next();
}
function startFeat()
{
  clearInterval(featTimer);
  paintFeatured();
  featTimer = setInterval(function ()
  {
    featIndex = (featIndex + 1) % FEATURED.length;
    paintFeatured();
  }, 8000);
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
  saveCustom(loadCustom().map(app => app.url === iconFor ? Object.assign({}, app, { icon }) : app));
  saveFavs(loadFavs().map(app => app.url === iconFor ? Object.assign({}, app, { icon }) : app));
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

function bumpIdle()
{
  clearTimeout(idleTimer);
  if (saverOn) return;
  const ms = getSaver().ms;
  if (!ms) return;
  idleTimer = setTimeout(showSaver, ms);
}
function showSaver()
{
  if (saverOn) return;
  saverOn = true;
  const box = document.createElement("div");
  box.className = "saver";
  box.id = "saver";
  box.onclick = hideSaver;
  box.innerHTML = `<div class="stime" id="stime"></div><div class="sdate" id="sdate"></div>`;
  screen.appendChild(box);
  paintClock();
}
function hideSaver()
{
  saverOn = false;
  const box = document.getElementById("saver");
  if (box) box.remove();
  bumpIdle();
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
  saverOn = false;
  clearInterval(featTimer);
  screen.className = "theme-" + getTheme() + " wall-none";
  applyWall();
  screen.innerHTML = `
    <aside class="sidebar">
      <div class="brand">Belmonte <b>TV</b></div>
      <nav class="nav">
        ${MENU.map(item => `
          <div class="nav-item ${page === item.id ? "active" : ""}" onclick="Go('${item.id}')">
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
  bumpIdle();
}

function Go(id)
{
  picking = false;
  removing = false;
  addingApp = false;
  choosingTz = false;
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
      <div class="featured" id="featured"></div>
      <div class="section-title">${favs.length ? "Favorites" : "Suggested"}</div>
      <div class="grid">${row.map(app => AppTile(app, "open")).join("")}</div>
    `;
    startFeat();
    return;
  }
  if (page === "live")
  {
    main.innerHTML = `
      <h1>Live TV</h1>
      <div class="grid">${LIVE.map(app => AppTile(app, "open")).join("")}</div>
    `;
    return;
  }
  if (page === "apps")
  {
    main.innerHTML = `<h1>Apps</h1><div class="grid">${apps.map(app => AppTile(app, "open")).join("")}</div>`;
    return;
  }
  if (page === "fav")
  {
    if (picking)
    {
      main.innerHTML = `
        <h1>Add favorite</h1>
        <div class="actions"><button class="btn" onclick="picking=false; Render()">Cancel</button></div>
        <div class="grid">${apps.map(app => AppTile(app, isFav(app.url) ? "disabled" : "add")).join("")}</div>
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
      ${favs.length
        ? `<div class="grid">${favs.map(app => AppTile(app, removing ? "remove" : "open")).join("")}</div>`
        : `<div class="empty">No favorites yet.</div>`}
    `;
    return;
  }
  if (page === "set")
  {
    if (choosingTz)
    {
      main.innerHTML = `
        <h1>Location</h1>
        <div class="settings-list">
          ${ZONES.map(item => `<div class="row" onclick="setTz('${item.id}')">${item.city}${getTz() === item.id ? "  ·  selected" : ""}</div>`).join("")}
          <div class="row" onclick="choosingTz=false; Render()">Cancel</div>
        </div>
      `;
      return;
    }
    if (addingApp || iconFor)
    {
      main.innerHTML = `
        <h1>${iconFor ? "Set icon" : "Add app"}</h1>
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
      <div class="section-title">Theme</div>
      <div class="settings-list">
        ${THEMES.map(item => `<div class="row" onclick="setTheme('${item.id}')">${item.label}${getTheme() === item.id ? "  ·  selected" : ""}</div>`).join("")}
      </div>
      <div class="section-title">Wallpaper</div>
      <div class="settings-list">
        <div class="row" onclick="setWall('none')">None${getWall() === "none" ? "  ·  selected" : ""}</div>
      </div>
      <div id="wall-box"></div>
      <div class="section-title">Location</div>
      <div class="settings-list">
        <div class="row" onclick="choosingTz=true; Render()">${tzLabel()}</div>
      </div>
      <div class="section-title">Screensaver</div>
      <div class="settings-list">
        ${SAVER_OPTS.map(item => `<div class="row" onclick="setSaver('${item.id}')">${item.label}${getSaver().id === item.id ? "  ·  selected" : ""}</div>`).join("")}
      </div>
      <div class="section-title">System</div>
      <div class="settings-list">
        <div class="row" onclick="addingApp=true; Render()">Add app</div>
        <div class="row" onclick="location.reload()">Reload interface</div>
        <div class="row" onclick="clearFavs()">Clear favorites</div>
        <div class="row" onclick="OpenURL('https://github.com/belmonte-labs/belmonte-os')">Open GitHub</div>
        <div class="row static">Version 3.8</div>
      </div>
      ${custom.length ? `
        <div class="section-title">Custom apps</div>
        <div class="settings-list">
          ${custom.map(app => `
            <div class="row" onclick="iconFor='${app.url}'; Render()">Set icon · ${app.name}</div>
            <div class="row" onclick="removeCustomApp('${app.url}')">Remove ${app.name}</div>
          `).join("")}
        </div>` : ""}
    `;
    fillWallBox();
  }
}

function AppTile(app, mode)
{
  if (mode === "disabled")
    return `<div class="tile disabled">${iconTag(app.icon, app.name)}<label>${app.name}</label></div>`;
  const click =
    mode === "add"    ? `addFav('${app.url}')` :
    mode === "remove" ? `removeFav('${app.url}')` :
                        `OpenURL('${app.url}')`;
  return `<div class="tile" onclick="${click}">${iconTag(app.icon, app.name)}<label>${app.name}</label></div>`;
}

function OpenURL(url)
{
  clearTimeout(idleTimer);
  clearInterval(featTimer);
  window.location.href = url;
}

function paintClock()
{
  const parts = nowParts();
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");
  const stime = document.getElementById("stime");
  const sdate = document.getElementById("sdate");
  if (clock) clock.textContent = parts.time;
  if (date) date.textContent = parts.date;
  if (stime) stime.textContent = parts.time;
  if (sdate) sdate.textContent = parts.date;
}
function UpdateClock()
{
  paintClock();
  if (window.ClockTimer) clearInterval(window.ClockTimer);
  window.ClockTimer = setInterval(paintClock, 1000);
}
