const API_KEY = "AIzaSyBBrPNgr5fqxicoUUnENPZdGh16A1qsKE8";
const CHANNEL_ID = "UCLbxGK4LAw781C1DaAj-RxA";



const iframe = document.getElementById("latestVideo");
const titleEl = document.getElementById("videoTitle");
const metaEl = document.getElementById("videoMeta");
const newBadge = document.getElementById("newBadge");
const liveBadge = document.getElementById("liveBadge");
const thumb = document.getElementById("videoThumb");
const fallback = document.getElementById("videoFallback");

const CACHE_KEY = "yt_cache_v2";
const CACHE_TIME = 1000 * 60 * 60 * 12; 

function durationToSeconds(iso) {
  const h = iso.match(/(\d+)H/)?.[1] || 0;
  const m = iso.match(/(\d+)M/)?.[1] || 0;
  const s = iso.match(/(\d+)S/)?.[1] || 0;
  return (+h * 3600) + (+m * 60) + (+s);
}

function isNew(publishedAt) {
  return (Date.now() - new Date(publishedAt)) < 1000 * 60 * 60 * 48;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}


const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
if (cached && Date.now() - cached.time < CACHE_TIME) {
  renderVideo(cached.video);
} else {
  fetchLatest();
}

function fetchLatest() {
  fetch(
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=id` +
    `&channelId=${CHANNEL_ID}` +
    `&order=date` +
    `&maxResults=15` +
    `&type=video` +
    `&key=${API_KEY}`
  )
  .then(r => r.json())
  .then(d => {
    const ids = d.items.map(v => v.id.videoId).join(",");
    return fetch(
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,contentDetails,status,liveStreamingDetails` +
      `&id=${ids}` +
      `&key=${API_KEY}`
    );
  })
  .then(r => r.json())
  .then(d => {
    const video = d.items.find(v => {
      const seconds = durationToSeconds(v.contentDetails.duration);
      return v.status.embeddable && seconds >= 61;
    });

    if (!video) throw "No valid video";

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      time: Date.now(),
      video
    }));

    renderVideo(video);
  })
  .catch(() => {
    iframe.hidden = true;
    fallback.hidden = false;
  });
}

function renderVideo(video) {
  const { id, snippet, liveStreamingDetails } = video;

  iframe.src = `https://www.youtube.com/embed/${id}?rel=0`;
  iframe.onload = () => iframe.classList.add("loaded");

  thumb.src = snippet.thumbnails.high.url;
  thumb.hidden = false;

  titleEl.textContent = snippet.title;
  metaEl.textContent = `Published: ${formatDate(snippet.publishedAt)}`;

  if (isNew(snippet.publishedAt)) newBadge.hidden = false;
  if (liveStreamingDetails?.actualStartTime) liveBadge.hidden = false;
}

function loadShorts() {
  fetch(
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet,id` +
    `&channelId=${CHANNEL_ID}` +
    `&order=date` +
    `&maxResults=6` +
    `&type=video` +
    `&key=${API_KEY}`
  )
  .then(r => r.json())
  .then(d => {
    const grid = document.getElementById("shortsGrid");
    d.items.forEach(v => {
      const img = v.snippet.thumbnails.medium.url;
      const link = `https://youtube.com/shorts/${v.id.videoId}`;

      grid.innerHTML += `
        <a class="short" href="${link}" target="_blank">
          <img src="${img}">
        </a>`;
    });
  });
}

loadShorts();
