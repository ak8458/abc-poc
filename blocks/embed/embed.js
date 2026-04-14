function embedVimeo(url) {
  const videoId = url.pathname.split('/').filter(Boolean).pop();
  return `<iframe src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&color=009ed5" title="Video" allowfullscreen></iframe>`;
}

export default function decorate(block) {
  const anchor = block.querySelector('a');
  if (!anchor) return;
  const url = new URL(anchor.href);
  if (url.hostname.includes('vimeo.com')) {
    block.innerHTML = embedVimeo(url);
    block.classList.add('embed-vimeo');
  }
}
