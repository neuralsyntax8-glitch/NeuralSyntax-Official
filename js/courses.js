const API_KEY = "AIzaSyBUD-uNlyeQKnczmbrRDRwmu4LVlSyOwSo";

fetch('data/courses.json')
  .then(res => res.json())
  .then(async data => {

    const container = document.getElementById("courses");

    for (const course of data) {

      // Fetch first video of playlist
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${course.playlistId}&key=${API_KEY}`
      );

      const result = await res.json();

      const video = result.items[0];
      const thumbnail = video.snippet.thumbnails.high.url;

      container.innerHTML += `
        <div class="bg-[#111827] rounded-xl overflow-hidden border border-[#1f2937] hover:border-[#22c1f1] transition group">

          <!-- Thumbnail -->
          <div class="relative">
            <img src="${thumbnail}" class="w-full h-48 object-cover">

            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span class="text-white font-semibold">View Course</span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h2 class="text-lg font-semibold">${course.title}</h2>

            <a href="course.html?id=${course.playlistId}" 
               class="text-[#22c1f1] text-sm mt-2 inline-block">
              Start Learning →
            </a>
          </div>

        </div>
      `;
    }
  });
