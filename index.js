function removeFromFavourites(station) {
    let favourites = getFavourites();
    favourites = favourites.filter(s => s.url !== station.url);
    localStorage.setItem('tevecade-favourites', JSON.stringify(favourites));
}
// Favourites helpers
function getFavourites() {
    const fav = localStorage.getItem('tevecade-favourites');
    return fav ? JSON.parse(fav) : [];
}

function addToFavourites(station) {
    let favourites = getFavourites();
    // Avoid duplicates by url
    if (!favourites.some(s => s.url === station.url)) {
        favourites.unshift(station);
        if (favourites.length > 25) favourites = favourites.slice(0, 25);
        localStorage.setItem('tevecade-favourites', JSON.stringify(favourites));
    }
}

function loadFavourites() {
    const favourites = getFavourites();
    const ul = document.querySelector('station-picker ul');
    ul.innerHTML = '';
    if (favourites.length === 0) {
        ul.innerHTML = '<li class="error-getting-stations">No favourites</li>';
        return;
    }
    favourites.forEach((station, idx) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        if (station.logo) {
            const img = document.createElement('img');
            img.src = station.logo;
            img.alt = station.name + ' logo';
            img.className = 'station-logo';
            img.loading = 'lazy';
            a.appendChild(img);
        }
        const span = document.createElement('span');
        span.textContent = station.name;
        a.appendChild(span);
        const number = document.createElement('span');
        number.className = 'station-number';
        number.textContent = idx + 1;
        a.appendChild(number);
        a.addEventListener('click', (e) => {
            e.preventDefault();
            addToRecentStations(station);
            const titlebarStationName = document.querySelector('.titlebar-station-name');
            if (titlebarStationName) {
                titlebarStationName.textContent = station.name;
            }
            const tvWatcher = document.querySelector('tv-watcher');
            tvWatcher.innerHTML = '';
            const video = document.createElement('video');
            video.setAttribute('controls', 'false');
            video.setAttribute('autoplay', '');
            video.setAttribute('width', '640');
            video.setAttribute('height', '360');
            video.setAttribute('playsinline', '');
            video.style.background = '#000';
            tvWatcher.appendChild(video);
            video.className = 'video-js vjs-default-skin';
            video.setAttribute('data-setup', '{"nativeControlsForTouch":true}');
            const source = document.createElement('source');
            source.src = station.url;
            source.type = 'application/x-mpegURL';
            video.appendChild(source);
            if (window.videojs) {
                const player = window.videojs(video, {
                    controls: false,
                    nativeControlsForTouch: false,
                    fluid: false,
                    responsive: false
                });
                player.ready(() => {
                    player.controls(false);
                    video.controls = false;
                });
            }
        });
        li.appendChild(a);
        li.dataset.url = station.url;
        ul.appendChild(li);
    });
    // Filter for favourites
    const filterInput = document.querySelector('station-picker input[type="text"]');
    const clearBtn = document.querySelector('.clear-btn');
    function filterList() {
        const filter = filterInput.value.trim().toLowerCase();
        const items = ul.querySelectorAll('li');
        items.forEach(li => {
            const name = li.textContent.trim().toLowerCase();
            if (name.includes(filter)) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        });
        clearBtn.style.display = filter ? 'inline' : 'none';
    }
    filterInput.addEventListener('input', filterList);
    clearBtn.addEventListener('click', function() {
        filterInput.value = '';
        filterInput.focus();
        filterList();
    });
    clearBtn.style.display = 'none';
}
function getRecentStations() {
    const recent = localStorage.getItem('tevecade-recent-stations');
    return recent ? JSON.parse(recent) : [];
}

function addToRecentStations(station) {
    let recentStations = getRecentStations();
    
    // Remove station if it already exists (to avoid duplicates)
    recentStations = recentStations.filter(s => s.url !== station.url);
    
    // Add station to the beginning of the array
    recentStations.unshift({
    name: station.name,
    url: station.url,
    logo: station.logo,
    timestamp: Date.now()
    });
    
    if (recentStations.length > 25) {
    recentStations = recentStations.slice(0, 25);
    }
    
    localStorage.setItem('tevecade-recent-stations', JSON.stringify(recentStations));
}

function loadRecentStations() {
    const recentStations = getRecentStations();
    const ul = document.querySelector('station-picker ul');
    
    if (recentStations.length === 0) {
    ul.innerHTML = '<li class="error-getting-stations">No recent stations</li>';
    return;
    }
    
    ul.innerHTML = '';
    recentStations.forEach((station, idx) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    if (station.logo) {
        const img = document.createElement('img');
        img.src = station.logo;
        img.alt = station.name + ' logo';
        img.className = 'station-logo';
        img.loading = 'lazy';
        a.appendChild(img);
    }
    const span = document.createElement('span');
    span.textContent = station.name;
    a.appendChild(span);
    const number = document.createElement('span');
    number.className = 'station-number';
    number.textContent = idx + 1;
    a.appendChild(number);
    a.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add station to recent list in localStorage
        addToRecentStations(station);
        
        // Update the titlebar station name
        const titlebarStationName = document.querySelector('.titlebar-station-name');
        if (titlebarStationName) {
        titlebarStationName.textContent = station.name;
        }
        
        const tvWatcher = document.querySelector('tv-watcher');
        tvWatcher.innerHTML = '';
        const video = document.createElement('video');
        video.setAttribute('controls', 'false');
        video.setAttribute('autoplay', '');
        video.setAttribute('width', '640');
        video.setAttribute('height', '360');
        video.setAttribute('playsinline', '');
        video.style.background = '#000';
        tvWatcher.appendChild(video);
        video.className = 'video-js vjs-default-skin';
        video.setAttribute('data-setup', '{"nativeControlsForTouch":true}');
        const source = document.createElement('source');
        source.src = station.url;
        source.type = 'application/x-mpegURL';
        video.appendChild(source);
        if (window.videojs) {
        const player = window.videojs(video, {
            controls: false,
            nativeControlsForTouch: false,
            fluid: false,
            responsive: false
        });
        
        // Force native controls by hiding Video.js controls
        player.ready(() => {
            player.controls(false);
            video.controls = false;
        });
        }
    });
    li.appendChild(a);
    li.dataset.url = station.url;
    ul.appendChild(li);
    });
    
    // Add filter functionality for recent stations
    const filterInput = document.querySelector('station-picker input[type="text"]');
    const clearBtn = document.querySelector('.clear-btn');
    function filterList() {
    const filter = filterInput.value.trim().toLowerCase();
    const items = ul.querySelectorAll('li');
    items.forEach(li => {
        const name = li.textContent.trim().toLowerCase();
        if (name.includes(filter)) {
        li.style.display = '';
        } else {
        li.style.display = 'none';
        }
    });
    clearBtn.style.display = filter ? 'inline' : 'none';
    }
    filterInput.addEventListener('input', filterList);
    clearBtn.addEventListener('click', function() {
    filterInput.value = '';
    filterInput.focus();
    filterList();
    });
    clearBtn.style.display = 'none';
}

function getSelectedUrl() {
    const select = document.querySelector('.select-url select');
    return select ? select.value : '';
}
let FREETVM3U8URL = getSelectedUrl();

function requestFullscreen(elem) {
    if (elem.requestFullscreen) {
    elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
    }
}

async function loadStations(url) {
    const ul = document.querySelector('station-picker ul');
    
    // Handle recent stations
    if (url === 'recent') {
    loadRecentStations();
    return;
    }
    
    ul.innerHTML = '<li class="error-getting-stations">No stations selected</li>';
    try {
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.split('\n');
    let stations = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
        let name = 'Canal';
        let logo = '';
        const extinf = lines[i];
        let match = extinf.match(/tvg-id="([^"]+)"/);
        if (match && match[1]) {
            name = match[1].trim();
        } else {
            match = extinf.match(/tvg-name="([^"]+)"/);
            if (match && match[1]) {
            name = match[1].trim();
            } else {
            match = extinf.match(/group-title="([^"]+)"/);
            if (match && match[1]) {
                name = match[1].trim();
            } else {
                match = extinf.match(/,(.*)$/);
                if (match && match[1]) {
                name = match[1].trim();
                }
            }
            }
        }
        match = extinf.match(/tvg-logo="([^"]+)"/);
        if (match && match[1]) {
            logo = match[1].trim();
        }
        const url = lines[i+1] && !lines[i+1].startsWith('#') ? lines[i+1].trim() : '';
        if (url) stations.push({ name, url, logo });
        }
    }
    const filteredStations = stations.filter(station => station.url.endsWith('.m3u8'));
    ul.innerHTML = '';
    filteredStations.forEach((station, idx) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        if (station.logo) {
        const img = document.createElement('img');
        img.src = station.logo;
        img.alt = station.name + ' logo';
        img.className = 'station-logo';
        img.loading = 'lazy';
        a.appendChild(img);
        }
        const span = document.createElement('span');
        span.textContent = station.name;
        a.appendChild(span);
        const number = document.createElement('span');
        number.className = 'station-number';
        number.textContent = idx + 1;
        a.appendChild(number);
        a.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add station to recent list in localStorage
        addToRecentStations(station);
        
        // Update the titlebar station name
        const titlebarStationName = document.querySelector('.titlebar-station-name');
        if (titlebarStationName) {
            titlebarStationName.textContent = station.name;
        }
        
        const tvWatcher = document.querySelector('tv-watcher');
        tvWatcher.innerHTML = '';
        const video = document.createElement('video');
        video.setAttribute('controls', 'false');
        video.setAttribute('autoplay', '');
        video.setAttribute('width', '640');
        video.setAttribute('height', '360');
        video.setAttribute('playsinline', '');
        video.style.background = '#000';
        tvWatcher.appendChild(video);
        video.className = 'video-js vjs-default-skin';
        video.setAttribute('data-setup', '{"nativeControlsForTouch":true}');
        const source = document.createElement('source');
        source.src = station.url;
        source.type = 'application/x-mpegURL';
        video.appendChild(source);
        if (window.videojs) {
            const player = window.videojs(video, {
            controls: false,
            nativeControlsForTouch: false,
            fluid: false,
            responsive: false
            });
            
            // Force native controls by hiding Video.js controls
            player.ready(() => {
            player.controls(false);
            video.controls = false;
            });
        }
        });
        li.appendChild(a);
        li.dataset.url = station.url;
        ul.appendChild(li);
    });
    const filterInput = document.querySelector('station-picker input[type="text"]');
    const clearBtn = document.querySelector('.clear-btn');
    function filterList() {
        const filter = filterInput.value.trim().toLowerCase();
        const items = ul.querySelectorAll('li');
        items.forEach(li => {
        const name = li.textContent.trim().toLowerCase();
        if (name.includes(filter)) {
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
        });
        clearBtn.style.display = filter ? 'inline' : 'none';
    }
    filterInput.addEventListener('input', filterList);
    clearBtn.addEventListener('click', function() {
        filterInput.value = '';
        filterInput.focus();
        filterList();
    });
    clearBtn.style.display = 'none';
    } catch (e) {
    ul.innerHTML = '<li class="error-getting-stations">No stations selected</li>';
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // Populate intro-section cards
    function renderStationCards(list, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.innerHTML = '';
        if (!list.length) {
            const li = document.createElement('li');
            li.textContent = 'None';
            container.appendChild(li);
            return;
        }
        list.forEach(station => {
            const li = document.createElement('li');
            li.className = 'station-card';
            // Blurred background img
            if (station.logo) {
                const bgImg = document.createElement('img');
                bgImg.src = station.logo;
                bgImg.alt = '';
                bgImg.className = 'card-bg-blur';
                li.appendChild(bgImg);
            }
            // Inner wrapper for name only
            const inner = document.createElement('div');
            inner.className = 'station-card-inner';
            // Logo inside card (not blurred)
            if (station.logo) {
                const logoImg = document.createElement('img');
                logoImg.src = station.logo;
                logoImg.alt = station.name + ' logo';
                logoImg.className = 'card-logo';
                inner.appendChild(logoImg);
            }
            // Name
            const span = document.createElement('span');
            span.textContent = station.name;
            span.className = 'card-name';
            inner.appendChild(span);
            li.appendChild(inner);
            // Click to play
            li.addEventListener('click', function() {
                addToRecentStations(station);
                const titlebarStationName = document.querySelector('.titlebar-station-name');
                if (titlebarStationName) titlebarStationName.textContent = station.name;
                const tvWatcher = document.querySelector('tv-watcher');
                tvWatcher.innerHTML = '';
                const video = document.createElement('video');
                video.setAttribute('controls', 'false');
                video.setAttribute('autoplay', '');
                video.setAttribute('width', '640');
                video.setAttribute('height', '360');
                video.setAttribute('playsinline', '');
                video.style.background = '#000';
                tvWatcher.appendChild(video);
                video.className = 'video-js vjs-default-skin';
                video.setAttribute('data-setup', '{"nativeControlsForTouch":true}');
                const source = document.createElement('source');
                source.src = station.url;
                source.type = 'application/x-mpegURL';
                video.appendChild(source);
                if (window.videojs) {
                    const player = window.videojs(video, {
                        controls: false,
                        nativeControlsForTouch: false,
                        fluid: false,
                        responsive: false
                    });
                    player.ready(() => {
                        player.controls(false);
                        video.controls = false;
                    });
                }
            });
            container.appendChild(li);
        });
    }

    function updateIntroCards() {
        renderStationCards(getRecentStations(), '.cards-recently-watched');
        renderStationCards(getFavourites(), '.cards-favourites');
    }
    updateIntroCards();
    // Also update when favourites or recent change
    window.addEventListener('storage', updateIntroCards);
    // Ensure 'Favourites' option is always present in the select
    const selectEl = document.querySelector('.select-url select');
    if (selectEl && !Array.from(selectEl.options).some(opt => opt.value === 'favourites')) {
        const favOption = document.createElement('option');
        favOption.value = 'favourites';
        favOption.textContent = 'Favourites';
        selectEl.insertBefore(favOption, selectEl.options[2] || null); // after Recent
    }
    document.getElementById('fullscreen-btn').addEventListener('click', function() {
    requestFullscreen(document.querySelector('main'));
    });
    const select = document.querySelector('.select-url select');
    select.addEventListener('change', function() {
    FREETVM3U8URL = select.value;
    if (FREETVM3U8URL === 'recent') {
        loadRecentStations();
    } else if (FREETVM3U8URL === 'favourites') {
        loadFavourites();
    } else {
        loadStations(FREETVM3U8URL);
    }
    });
    FREETVM3U8URL = getSelectedUrl();
    if (FREETVM3U8URL === 'recent') {
        loadRecentStations();
    } else if (FREETVM3U8URL === 'favourites') {
        loadFavourites();
    } else {
        loadStations(FREETVM3U8URL);
    }
    // Favourite button logic
    const favouriteBtn = document.getElementById('favourite-btn');
    if (favouriteBtn) {
        function getCurrentStation() {
            const name = document.querySelector('.titlebar-station-name').textContent;
            let station = null;
            const recent = getRecentStations();
            station = recent.find(s => s.name === name);
            if (!station) {
                const favs = getFavourites();
                station = favs.find(s => s.name === name);
            }
            if (!station) {
                const ul = document.querySelector('station-picker ul');
                const li = Array.from(ul.querySelectorAll('li')).find(li => {
                    const a = li.querySelector('a span');
                    return a && a.textContent === name;
                });
                if (li) {
                    const a = li.querySelector('a');
                    const img = a.querySelector('img');
                    const url = li.dataset.url;
                    station = {
                        name,
                        url,
                        logo: img ? img.src : ''
                    };
                }
            }
            return station;
        }

        function updateFavouriteBtn() {
            const station = getCurrentStation();
            const favs = getFavourites();
            if (station && favs.some(s => s.url === station.url)) {
                favouriteBtn.classList.add('favourited');
            } else {
                favouriteBtn.classList.remove('favourited');
            }
        }

        favouriteBtn.addEventListener('click', function() {
            const station = getCurrentStation();
            if (!station) return;
            const favs = getFavourites();
            const isFav = favs.some(s => s.url === station.url);
            if (isFav) {
                removeFromFavourites(station);
                favouriteBtn.classList.remove('favourited');
            } else {
                addToFavourites(station);
                favouriteBtn.classList.add('favourited');
            }
        });

        // Update icon on station change
        const titlebarStationName = document.querySelector('.titlebar-station-name');
        const observer = new MutationObserver(updateFavouriteBtn);
        observer.observe(titlebarStationName, { childList: true });
        // Initial state
        updateFavouriteBtn();
    }

    // Hide sidebar logic
    const hideSidebarBtn = document.getElementById('hide-sidebar-btn');
    const main = document.querySelector('main');
    const tvWatcherContainer = document.querySelector('.tv-watcher-container');
    hideSidebarBtn.addEventListener('click', function() {
    main.classList.toggle('sidebar-hidden');
    tvWatcherContainer.classList.toggle('maximized');
    });

    // Show control-bar only when video.js controls are visible
    function setupVideoJsControlBarSync() {
    const tvWatcher = document.querySelector('tv-watcher');
    const container = document.querySelector('.tv-watcher-container');
    const observer = new MutationObserver(() => {
        const video = tvWatcher.querySelector('video');
        if (!video || !window.videojs) return;
        const vjs = window.videojs.getPlayer ? window.videojs.getPlayer(video) : window.videojs(video);
        if (!vjs) return;
        vjs.ready(function() {
        vjs.on('userinactive', function() {
            container.classList.remove('controls-visible');
        });
        vjs.on('useractive', function() {
            container.classList.add('controls-visible');
        });
        // Initial state
        if (vjs.userActive()) {
            container.classList.add('controls-visible');
        } else {
            container.classList.remove('controls-visible');
        }
        });
    });
    observer.observe(tvWatcher, { childList: true, subtree: true });
    }
    setupVideoJsControlBarSync();
    // Make control-bar click add controls-visible to tv-watcher-container
    const controlBar = document.querySelector('control-bar');
    if (controlBar && tvWatcherContainer) {
        controlBar.addEventListener('click', function(e) {
            tvWatcherContainer.classList.add('controls-visible');
        });
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
