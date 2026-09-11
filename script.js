//==================================================
// BELMONTE OS
// script.js
// Belmonte Labs
//==================================================

const screen = document.getElementById("screen");

const Apps = [
    { icon: "▶",  name: "YouTube",   command: "OPEN_YOUTUBE" },
    { icon: "◉",  name: "Pluto TV",  command: "OPEN_PLUTO" },
    { icon: "🟣", name: "Twitch",    command: "OPEN_TWITCH" },
    { icon: "🌐", name: "Browser",   command: "OPEN_BROWSER" },
    { icon: "🎵", name: "Music",     command: "OPEN_MUSIC" },
    { icon: "👥", name: "Kosmi",     command: "OPEN_KOSMI" },
    { icon: "★",  name: "Favorites", command: "OPEN_FAVORITES" },
    { icon: "⚙",  name: "Settings",  command: "OPEN_SETTINGS" }
];

const Favorites = [
    { icon: "▶",  name: "YouTube",     url: "https://www.youtube.com" },
    { icon: "◉",  name: "Pluto TV",    url: "https://pluto.tv" },
    { icon: "🟣", name: "Twitch",      url: "https://www.twitch.tv" },
    { icon: "🌐", name: "Google",      url: "https://www.google.com" },
    { icon: "🎵", name: "YT Music",    url: "https://music.youtube.com" },
    { icon: "👥", name: "Kosmi",       url: "https://kosmi.io" },
    { icon: "📺", name: "Tubi",        url: "https://tubitv.com" },
    { icon: "💻", name: "GitHub",      url: "https://github.com/belmonte-labs/belmonte-os" }
];

const Settings = [
    { icon: "⟳", name: "Reboot", action: "REBOOT" },
    { icon: "⌂", name: "Home",   action: "HOME" },
    { icon: "💻", name: "GitHub", action: "GITHUB" },
    { icon: "ℹ", name: "About",  action: "ABOUT" }
];

Boot();

function Boot()
{
    screen.innerHTML = `
        <div class="boot">
            <h1>BELMONTE</h1>
            <h2>OS</h2>
            <p>Initializing...</p>
            <div class="loading"></div>
        </div>
    `;

    setTimeout(Home, 2500);
}

function Home()
{
    let html = "";

    for (const app of Apps)
    {
        html += `
            <div class="app" onclick="OpenApp('${app.command}')">
                <div class="icon">${app.icon}</div>
                <div class="label">${app.name}</div>
            </div>
        `;
    }

    screen.innerHTML = `
        <div class="topbar">
            <div class="logo">BELMONTE OS</div>
            <div class="status">
                <span>Connected</span>
                <span id="clock">00:00</span>
            </div>
        </div>
        <div class="content">
            <div class="app-grid">${html}</div>
        </div>
    `;

    UpdateClock();
}

function UpdateClock()
{
    const clock = document.getElementById("clock");
    if (!clock) return;

    function Tick()
    {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    Tick();

    if (window.ClockTimer) clearInterval(window.ClockTimer);
    window.ClockTimer = setInterval(Tick, 1000);
}

function OpenApp(command)
{
    switch (command)
    {
        case "OPEN_YOUTUBE":
            OpenURL("https://www.youtube.com");
            break;

        case "OPEN_PLUTO":
            OpenURL("https://pluto.tv");
            break;

        case "OPEN_TWITCH":
            OpenURL("https://www.twitch.tv");
            break;

        case "OPEN_BROWSER":
            OpenURL("https://www.google.com");
            break;

        case "OPEN_MUSIC":
            OpenURL("https://music.youtube.com");
            break;

        case "OPEN_KOSMI":
            OpenURL("https://kosmi.io");
            break;

        case "OPEN_FAVORITES":
            ShowFavorites();
            break;

        case "OPEN_SETTINGS":
            ShowSettings();
            break;
    }
}

function OpenURL(url)
{
    screen.style.background = "#000";

    setTimeout(function ()
    {
        window.location.href = url;
    }, 300);
}

function ShowFavorites()
{
    let html = "";

    for (const favorite of Favorites)
    {
        html += `
            <div class="app" onclick="OpenURL('${favorite.url}')">
                <div class="icon">${favorite.icon}</div>
                <div class="label">${favorite.name}</div>
            </div>
        `;
    }

    screen.innerHTML = `
        <div class="topbar">
            <div class="logo">FAVORITES</div>
            <div class="status">
                <span class="app" onclick="Home()">Home</span>
            </div>
        </div>
        <div class="content">
            <div class="app-grid">${html}</div>
        </div>
    `;
}

function ShowSettings()
{
    let html = "";

    for (const item of Settings)
    {
        html += `
            <div class="app" onclick="RunSetting('${item.action}')">
                <div class="icon">${item.icon}</div>
                <div class="label">${item.name}</div>
            </div>
        `;
    }

    screen.innerHTML = `
        <div class="topbar">
            <div class="logo">SETTINGS</div>
            <div class="status">
                <span class="app" onclick="Home()">Home</span>
            </div>
        </div>
        <div class="content">
            <div class="app-grid">${html}</div>
        </div>
    `;
}

function RunSetting(action)
{
    switch (action)
    {
        case "REBOOT":
            location.reload();
            break;

        case "HOME":
            Home();
            break;

        case "GITHUB":
            OpenURL("https://github.com/belmonte-labs/belmonte-os");
            break;

        case "ABOUT":
            screen.innerHTML = `
                <div class="topbar">
                    <div class="logo">ABOUT</div>
                    <div class="status">
                        <span class="app" onclick="ShowSettings()">Back</span>
                    </div>
                </div>
                <div class="content">
                    <div style="text-align:center;">
                        <h2>Belmonte OS</h2>
                        <br>
                        <p>Version 2.0</p>
                        <br>
                        <p>Designed by Belmonte Labs</p>
                        <br>
                        <p>Powered by HTML, CSS, JavaScript & Second Life</p>
                    </div>
                </div>
            `;
            break;
    }
}

window.addEventListener("message", function (event)
{
    console.log("Receiver:", event.data);
});
