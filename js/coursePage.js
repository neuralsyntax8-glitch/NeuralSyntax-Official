// 🔑 Your API Key
const API_KEY = "AIzaSyBUD-uNlyeQKnczmbrRDRwmu4LVlSyOwSo";

// 📌 Get playlist ID from URL
const params = new URLSearchParams(window.location.search);
const playlistId = params.get("id");

console.log("JS LOADED");
console.log("Playlist ID:", playlistId);

// 🎥 Elements
const player = document.getElementById("player");
const container = document.getElementById("videos");

// 📦 Data
let videoList = [];
let currentIndex = 0;

// 🚀 Load Videos
async function loadVideos() {
  if (!playlistId) {
    console.error("❌ No playlist ID found in URL");
    return;
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`
    );

    const data = await res.json();
    console.log("API DATA:", data);

    if (!data.items || data.items.length === 0) {
      console.error("❌ No videos found. Check playlist or API.");
      return;
    }

    videoList = data.items;

    renderVideos();

    // ▶️ Play first valid video
    playFirstValidVideo();

  } catch (error) {
    console.error("❌ Fetch error:", error);
  }
}

// 🧩 Render Video List (SAFE VERSION)
function renderVideos() {
  container.innerHTML = "";

  videoList.forEach((video, index) => {

    // ✅ Skip invalid videos
    if (
      !video.snippet ||
      !video.snippet.resourceId ||
      !video.snippet.resourceId.videoId
    ) {
      console.warn("⚠️ Skipped invalid video:", video);
      return;
    }

    const vid = video.snippet.resourceId.videoId;
    const title = video.snippet.title;
    const thumb = video.snippet.thumbnails?.medium?.url;

    container.innerHTML += `
      <div onclick="playVideo(${index})" 
           id="video-${index}"
           class="flex gap-3 cursor-pointer p-2 rounded-lg transition hover:bg-[#111827]">

        <img src="${thumb}" class="w-24 rounded">

        <p class="text-sm">${title}</p>
      </div>
    `;
  });
}

// ▶️ Play First Valid Video
function playFirstValidVideo() {
  for (let i = 0; i < videoList.length; i++) {
    const video = videoList[i];

    if (video?.snippet?.resourceId?.videoId) {
      playVideo(i);
      return;
    }
  }

  console.error("❌ No valid videos to play");
}

// ▶️ Play Selected Video
function playVideo(index) {
  const video = videoList[index];

  if (!video || !video.snippet?.resourceId?.videoId) {
    console.error("❌ Invalid video at index:", index);
    return;
  }

  currentIndex = index;

  const vid = video.snippet.resourceId.videoId;

  player.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;

  highlightActive();
}

// 🎯 Highlight Active Video
function highlightActive() {
  videoList.forEach((_, i) => {
    const el = document.getElementById(`video-${i}`);
    if (!el) return;

    if (i === currentIndex) {
      el.classList.add("bg-[#22c1f1]/20");
    } else {
      el.classList.remove("bg-[#22c1f1]/20");
    }
  });
}

// ⏭ Next Video
function nextVideo() {
  let nextIndex = currentIndex + 1;

  while (nextIndex < videoList.length) {
    const video = videoList[nextIndex];

    if (video?.snippet?.resourceId?.videoId) {
      playVideo(nextIndex);
      return;
    }

    nextIndex++;
  }

  alert("🎉 Course completed!");
}

// 🔄 Start
loadVideos();
