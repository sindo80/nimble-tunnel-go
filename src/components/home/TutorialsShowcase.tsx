import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Clock, Eye, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTutorials } from "@/hooks/useTutorials";
import { useAuth } from "@/contexts/AuthContext";
import type { Tutorial } from "@/hooks/useTutorials";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const apMatch = url.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/);
  if (apMatch) return `https://www.aparat.com/video/video/embed/videohash/${apMatch[1]}/vt/frame`;
  return url;
}

function VideoCard({ tutorial, onClick }: { tutorial: Tutorial; onClick: () => void }) {
  return (
    <div
      className="shrink-0 w-[240px] sm:w-[280px] cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-video bg-muted/30 rounded-2xl overflow-hidden shadow-md border border-border/40 group-hover:border-primary/50 transition-all duration-300">
        {tutorial.thumbnail_url ? (
          <img
            src={tutorial.thumbnail_url}
            alt={tutorial.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Play className="h-10 w-10 text-primary/50" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </div>
        {tutorial.category && (
          <Badge className="absolute top-2 right-2 text-xs" variant="secondary">
            {tutorial.category}
          </Badge>
        )}
      </div>
      <div className="mt-2 px-1 space-y-1">
        <p className="text-sm font-semibold line-clamp-1">{tutorial.title}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {tutorial.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />{tutorial.duration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />{tutorial.view_count}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TutorialsShowcase() {
  const { user } = useAuth();
  const { tutorials, loading } = useTutorials({ limit: 12 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || tutorials.length < 2) return;

    let animId: number;
    const animate = () => {
      if (!isPaused && el) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, tutorials.length]);

  if (loading || tutorials.length === 0) return null;

  // For guests show only free tutorials, for logged-in show all
  const visibleTutorials = user ? tutorials : tutorials.filter(t => t.is_free);
  if (visibleTutorials.length === 0) return null;

  const items = [...visibleTutorials, ...visibleTutorials];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">آموزش‌های ویدیویی</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {user ? "آخرین ویدیوهای آموزشی ویژه شما" : "برای دسترسی کامل وارد شوید"}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tutorials">
              مشاهده همه
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Fade edges */}
          <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-hidden pb-4"
            style={{ scrollBehavior: "auto" }}
          >
            {items.map((t, i) => (
              <VideoCard
                key={`${t.id}-${i}`}
                tutorial={t}
                onClick={() => user ? setSelectedTutorial(t) : undefined}
              />
            ))}
          </div>
        </div>

        {/* CTA for guests */}
        {!user && (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm mb-3">برای تماشای ویدیوها ابتدا وارد حساب کاربری شوید</p>
            <Button asChild>
              <Link to="/auth">ورود / ثبت‌نام</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden w-[95vw]">
          {selectedTutorial && (
            <div>
              <div className="aspect-video bg-black">
                {selectedTutorial.video_type === "embed" ? (
                  <iframe
                    src={getEmbedUrl(selectedTutorial.video_url)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <video src={selectedTutorial.video_url} controls className="w-full h-full" autoPlay />
                )}
              </div>
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-bold">{selectedTutorial.title}</h2>
                {selectedTutorial.description && (
                  <p className="text-muted-foreground text-sm">{selectedTutorial.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
