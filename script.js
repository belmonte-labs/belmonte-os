const screen = document.getElementById("screen");
const FAV_KEY = "belmonte_favs";

const MENU = [
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

let page = "apps";
let picking = false;
let removing = false;

Render();

function loadFavs()
{
  try
  {
    const raw = localStorage.getItem(FAV_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  }
  catch (e)
  {
    return [];
  }
}

function saveFavs(list)
{
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

function isFav(url)
{
  return loadFavs().some(item => item.url === url);
}

function addFav(url)
{
  const app = APPS.find(item => item.url === url);
  if (!app || isFav(url)) return;
  const list = loadFavs();
  list.push(app);
  saveFavs(list);
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
  if (id === "live") return OpenURL("https://pluto.tv");
  if (id === "web")  return OpenURL("https://www.google.com");
  page = id;
  Render();
}

function DrawPage()
{
  const main = document.getElementById("main");
  const favs = loadFavs();

  if (page === "apps")
  {
    main.innerHTML = `
      <div class="kicker">Library</div>
      <h1>Apps</h1>
      <div class="sub">Select an application</div>
      <div class="grid">${APPS.map(app => AppTile(app, "open")).join("")}</div>
    `;
    return;
  }

  if (page === "fav")
  {
    if (picking)
    {
      main.innerHTML = `
        <div class="kicker">Library</div>
        <h1>Add favorite</h1>
        <div class="sub">Choose an app to pin</div>
        <div class="actions">
          <button class="btn" onclick="picking=false; Render()">Cancel</button>
        </div>
        <div class="grid picker">
          ${APPS.map(app => AppTile(app, isFav(app.url) ? "disabled" : "add")).join("")}
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <div class="kicker">Library</div>
      <h1>Favorites</h1>
      <div class="sub">${removing ? "Tap an app to remove it" : "Your pinned apps"}</div>
      <div class="actions">
        <button class="btn" onclick="picking=true; removing=false; Render()">Add favorite</button>
        ${favs.length ? `<button class="btn" onclick="removing=${!removing}; Render()">${removing ? "Done" : "Remove"}</button>` : ""}
        ${favs.length ? `<button class="btn" onclick="clearFavs()">Clear all</button>` : ""}
      </div>
      ${
        favs.length
          ? `<div class="grid">${favs.map(app => AppTile(app, removing ? "remove" : "open")).join("")}</div>`
          : `<div class="empty">No favorites yet.<br>Use Add favorite to pin an app.</div>`
      }
    `;
    return;
  }

  if (page === "set")
  {
    main.innerHTML = `
      <div class="kicker">System</div>
      <h1>Settings</h1>
      <div class="sub">Belmonte TV</div>
      <div class="settings-list">
        <div class="row" onclick="location.reload()">Reload interface</div>
        <div class="row" onclick="clearFavs()">Clear favorites</div>
        <div class="row" onclick="OpenURL('https://github.com/belmonte-labs/belmonte-os')">Open GitHub</div>
        <div class="row static">Version 2.4</div>
      </div>
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
    clock.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
    date.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };

  tick();
  if (window.ClockTimer) clearInterval(window.ClockTimer);
  window.ClockTimer = setInterval(tick, 1000);
}
