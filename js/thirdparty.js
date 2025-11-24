// YouTube Embed
function loadYouTubeVideo() {
  const container = document.getElementById("youtube-container");
  if (!container) return;
  container.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="YouTube video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;
}

// Initialize third-party content on Journal page
document.addEventListener("DOMContentLoaded", () => {
  loadYouTubeVideo();
});
