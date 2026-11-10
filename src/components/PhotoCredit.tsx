import type { Photo } from "../../shared/varieties";

// The credit every photo needs: who took it, its licence, and a link to its Commons page.
export default function PhotoCredit({ photo, className = "" }: { photo: Photo; className?: string }) {
  const author = photo.author.length > 40 ? `${photo.author.slice(0, 38)}…` : photo.author;
  return (
    <span className={`photo-credit ${className}`}>
      Photo:{" "}
      <a href={photo.page} target="_blank" rel="noreferrer" title={photo.author}>
        {author}
      </a>
      ,{" "}
      {photo.licenceUrl ? (
        <a href={photo.licenceUrl} target="_blank" rel="noreferrer">
          {photo.licence}
        </a>
      ) : (
        photo.licence
      )}
    </span>
  );
}
