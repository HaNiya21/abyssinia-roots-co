import { Link } from "@tanstack/react-router";

export interface CollectionCardProps {
  handle: string;
  title: string;
  description: string;
  image: string;
}

export function CollectionCard({ handle, title, description, image }: CollectionCardProps) {
  return (
    <Link to="/collections/$handle" params={{ handle }} className="group relative block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-5 text-white md:p-6">
          <h3 className="font-serif text-xl font-semibold md:text-2xl">{title}</h3>
          <p className="mt-1 max-w-xs text-sm text-white/80">{description}</p>
          <span className="mt-3 inline-block text-sm font-medium underline underline-offset-4 transition-colors group-hover:text-gold">
            Shop now
          </span>
        </div>
      </div>
    </Link>
  );
}
