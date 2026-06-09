import { mediaUrl } from "../../services/api";
import Button from "../ui/Button";
import {
  parseYouTubeId,
  parseVimeoId,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  vimeoEmbedUrl,
} from "../../utils/video";

const Frame = ({ src, title }) => (
  <div className="aspect-video w-full overflow-hidden rounded-lg border border-line bg-black">
    <iframe
      src={src}
      title={title}
      className="h-full w-full"
      allow="accelerator; autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  </div>
);

const ExternalCard = ({ href, label }) => (
  <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-lg border border-line bg-accent-soft">
    <p className="text-small text-muted">Este video se reproduce en su plataforma original.</p>
    <Button as="a" href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </Button>
  </div>
);

export default function VideoPlayer({ content }) {
  const { provider, url, embeddable, title } = content;

  if (provider === "youtube") {
    const id = parseYouTubeId(url);
    if (id && embeddable) return <Frame src={youtubeEmbedUrl(id)} title={title} />;
    return <ExternalCard href={id ? youtubeWatchUrl(id) : url} label="Ver en YouTube" />;
  }

  if (provider === "vimeo") {
    const id = parseVimeoId(url);
    if (id && embeddable) return <Frame src={vimeoEmbedUrl(id)} title={title} />;
    return <ExternalCard href={url} label="Ver en Vimeo" />;
  }

  // direct
  return (
    <video
      controls
      className="aspect-video w-full rounded-lg border border-line bg-black"
      src={mediaUrl(url)}
    >
      Tu navegador no soporta video.
    </video>
  );
}
