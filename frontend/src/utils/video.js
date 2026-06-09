export function parseYouTubeId(url = "") {
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export function parseVimeoId(url = "") {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export const youtubeEmbedUrl = (id) => `https://www.youtube.com/embed/${id}`;
export const youtubeWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
export const vimeoEmbedUrl = (id) => `https://player.vimeo.com/video/${id}`;
