import { mediaUrl } from "../../services/api";
import VideoPlayer from "./VideoPlayer";

export default function ContentViewer({ content }) {
  if (!content) return null;

  return (
    <div>
      <h2 className="mb-4 text-h3">{content.title}</h2>
      {content.type === "video" ? (
        <VideoPlayer content={content} />
      ) : (
        <iframe
          src={mediaUrl(content.url)}
          title={content.title}
          className="h-[70vh] w-full rounded-lg border border-line bg-surface"
        />
      )}
    </div>
  );
}
