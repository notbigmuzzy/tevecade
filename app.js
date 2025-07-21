// const FREETVM3U8URL = 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8'

const FREETVM3U8URL = 'https://iptv-org.github.io/iptv/countries/rs.m3u';


window.addEventListener('DOMContentLoaded', async () => {
  const ul = document.querySelector('station-picker ul');
  ul.innerHTML = '<li>Cargando estaciones...</li>';
  try {
    const res = await fetch(FREETVM3U8URL);
    const text = await res.text();
    const lines = text.split('\n');
    let stations = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('#EXTINF')) {
        // Use tvg-id as the channel name if present, else fallback
        let name = 'Canal';
        let logo = '';
        const extinf = lines[i];
        let match = extinf.match(/tvg-id="([^"]+)"/);
        if (match && match[1]) {
          name = match[1].trim();
        } else {
          // Try tvg-name
          match = extinf.match(/tvg-name="([^"]+)"/);
          if (match && match[1]) {
            name = match[1].trim();
          } else {
            // Try group-title
            match = extinf.match(/group-title="([^"]+)"/);
            if (match && match[1]) {
              name = match[1].trim();
            } else {
              // Fallback: use text after last comma
              match = extinf.match(/,(.*)$/);
              if (match && match[1]) {
                name = match[1].trim();
              }
            }
          }
        }
        // Get tvg-logo
        match = extinf.match(/tvg-logo="([^"]+)"/);
        if (match && match[1]) {
          logo = match[1].trim();
        }
        const url = lines[i+1] && !lines[i+1].startsWith('#') ? lines[i+1].trim() : '';
        if (url) stations.push({ name, url, logo });
      }
    }
    ul.innerHTML = '';
    stations.forEach(station => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      // Add logo if present
      if (station.logo) {
        const img = document.createElement('img');
        img.src = station.logo;
        img.alt = station.name + ' logo';
        img.className = 'station-logo';
        a.appendChild(img);
      }
      const span = document.createElement('span');
      span.textContent = station.name;
      a.appendChild(span);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const tvWatcher = document.querySelector('tv-watcher');
        // Remove previous player if exists
        tvWatcher.innerHTML = '';
        // Create video element for Video.js
        const video = document.createElement('video');
        video.className = 'video-js vjs-default-skin';
        video.setAttribute('controls', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('width', '640');
        video.setAttribute('height', '360');
        video.setAttribute('data-setup', '{}');
        const source = document.createElement('source');
        source.src = station.url;
        source.type = 'application/x-mpegURL';
        video.appendChild(source);
        tvWatcher.appendChild(video);
        // Initialize Video.js
        if (window.videojs) {
          window.videojs(video);
        }
      });
      li.appendChild(a);
      li.dataset.url = station.url;
      ul.appendChild(li);
    });
    // Filtering logic with clear button
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
    // Hide clear button initially
    clearBtn.style.display = 'none';
  } catch (e) {
    ul.innerHTML = '<li>Error cargando estaciones</li>';
  }
});

