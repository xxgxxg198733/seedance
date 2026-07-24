import { Button } from "@/components/ui/button";
import { Compass, Heart, Play } from "lucide-react";
import Link from "next/link";

const galleryItems = [
  {
    id: "1",
    title: "Cinematic sunset over mountains",
    creator: "Alice",
    type: "video",
    thumbnail: "https://picsum.photos/600/338",
    likes: 234,
  },
  {
    id: "2",
    title: "Futuristic city at night",
    creator: "Bob",
    type: "image",
    thumbnail: "https://picsum.photos/600/600",
    likes: 567,
  },
  {
    id: "3",
    title: "Calm ocean waves with piano",
    creator: "Carol",
    type: "audio",
    thumbnail: "",
    likes: 123,
  },
  {
    id: "4",
    title: "Product ad for sneakers",
    creator: "Dave",
    type: "video",
    thumbnail: "https://picsum.photos/600/338",
    likes: 892,
  },
  {
    id: "5",
    title: "Cyberpunk character portrait",
    creator: "Eve",
    type: "image",
    thumbnail: "https://picsum.photos/600/600",
    likes: 345,
  },
];

export default function ExplorePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Compass className="h-7 w-7 text-violet-400" /> Explore
          </h1>
          <p className="mt-2 text-zinc-400">Discover amazing creations from the community.</p>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-violet-500/30 transition-all cursor-pointer"
            >
              {item.thumbnail ? (
                <div className="relative">
                  <img src={item.thumbnail} alt={item.title} className="w-full" />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center bg-zinc-800">
                  <Compass className="h-8 w-8 text-zinc-600" />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">by {item.creator}</span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Heart className="h-3 w-3" /> {item.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
