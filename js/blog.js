const API_KEY = "AIzaSyBwZqjDw8BqI5H-hLqqclcR_-o-izOusYw";
const BLOG_URL = "https://neuralsyntaxofficial.blogspot.com";

async function loadPosts() {
  const grid = document.getElementById("blog-grid");

  try {
    // Step 1: Get Blog ID
    const blogRes = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/byurl?url=${BLOG_URL}&key=${API_KEY}`
    );
    const blogData = await blogRes.json();

    const blogId = blogData.id;

    // Step 2: Get Posts
    const postRes = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${API_KEY}&maxResults=12`
    );
    const postData = await postRes.json();

    if (!postData.items || postData.items.length === 0) {
      grid.innerHTML = `<div class="error">📭 No posts available.</div>`;
      return;
    }

    grid.innerHTML = "";

    postData.items.forEach((post) => {
      const title = post.title;
      const postId = post.id;

      // Extract image from content
      let img = "";
      const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        img = imgMatch[1];
      } else {
        img =
          "https://via.placeholder.com/800x400?text=No+Image";
      }

      // Clean summary
      let summary = post.content.replace(/<[^>]*>/g, "").trim();
      if (summary.length > 140) {
        summary = summary.slice(0, 140) + "…";
      }

      const card = `
        <a href="blog.html?id=${postId}" class="post-card">
          <div class="post-banner" style="background-image: url('${img}');"></div>
          <div class="post-content">
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(summary)}</p>
          </div>
        </a>
      `;

      grid.innerHTML += card;
    });

  } catch (error) {
    console.error(error);
    grid.innerHTML = `<div class="error">❌ Failed to load posts.</div>`;
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Run function
loadPosts();
