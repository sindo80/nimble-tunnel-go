import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useTutorials } from "@/hooks/useTutorials";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Play, Clock, Eye, Lock } from "lucide-react";
import type { Tutorial } from "@/hooks/useTutorials";

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Aparat
  const apMatch = url.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/);
  if (apMatch) return `https://www.aparat.com/video/video/embed/videohash/${apMatch[1]}/vt/frame`;
  return url;
}

export default function Tutorials() {
  const { tutorials, loading } = useTutorials();
  const [search, setSearch] = useState("");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(tutorials.map(t => t.category).filter(Boolean))] as string[];

  const filtered = tutorials.filter(t => {
    const matchSearch = !search || t.title.includes(search) || t.description?.includes(search);
    const matchCat = !selectedCategory || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">آموزش‌های ویدیویی</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">آموزش‌های تخصصی فارکس از مبتدی تا پیشرفته</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="جستجوی ویدیو..." value={search} onChange={e => setSearch(e.target.value)} className="pr-10" />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)}>همه</Button>
            {categories.map(c => (
              <Button key={c} variant={selectedCategory === c ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(c)}>{c}</Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <Card key={t.id} className="group cursor-pointer overflow-hidden hover:border-primary/50 transition-colors" onClick={() => setSelectedTutorial(t)}>
                <div className="relative aspect-video bg-muted/50 flex items-center justify-center overflow-hidden">
                  {t.thumbnail_url ? (
                    <img src={t.thumbnail_url} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <Play className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary-foreground fill-current" />
                    </div>
                  </div>
                  {!t.is_free && (
                    <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground"><Lock className="h-3 w-3 ml-1" />ویژه</Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold line-clamp-1">{t.title}</h3>
                  {t.description && <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {t.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration}</span>}
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{t.view_count} بازدید</span>
                    {t.category && <Badge variant="secondary" className="text-xs">{t.category}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">ویدیویی یافت نشد</div>
        )}
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedTutorial && (
            <div>
              <div className="aspect-video bg-black">
                {selectedTutorial.video_type === "embed" ? (
                  <iframe src={getEmbedUrl(selectedTutorial.video_url)} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                ) : (
                  <video src={selectedTutorial.video_url} controls className="w-full h-full" />
                )}
              </div>
              <div className="p-6 space-y-2">
                <h2 className="text-xl font-bold">{selectedTutorial.title}</h2>
                {selectedTutorial.description && <p className="text-muted-foreground">{selectedTutorial.description}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
