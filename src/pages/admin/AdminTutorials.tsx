import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2, Upload, Video, X, Link, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tutorial } from "@/hooks/useTutorials";

interface TutorialFormData {
  title: string;
  description: string;
  video_type: "embed" | "upload";
  video_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  is_free: boolean;
  is_active: boolean;
  sort_order: string;
}

const initialFormData: TutorialFormData = {
  title: "",
  description: "",
  video_type: "embed",
  video_url: "",
  thumbnail_url: "",
  duration: "",
  category: "",
  is_free: true,
  is_active: true,
  sort_order: "0",
};

export default function AdminTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [formData, setFormData] = useState<TutorialFormData>(initialFormData);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchTutorials = async () => {
    const { data, error } = await supabase
      .from("tutorials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    } else {
      setTutorials((data as Tutorial[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTutorials(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "خطا", description: "حداکثر حجم فایل ۱۰۰ مگابایت است", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("tutorial-videos").upload(fileName, file);
    if (error) {
      toast({ title: "خطا در آپلود", description: error.message, variant: "destructive" });
    } else {
      const { data: { publicUrl } } = supabase.storage.from("tutorial-videos").getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, video_url: publicUrl }));
      toast({ title: "موفق", description: "ویدیو آپلود شد" });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const tutorialData = {
      title: formData.title,
      description: formData.description || null,
      video_type: formData.video_type,
      video_url: formData.video_url,
      thumbnail_url: formData.thumbnail_url || null,
      duration: formData.duration || null,
      category: formData.category || null,
      is_free: formData.is_free,
      is_active: formData.is_active,
      sort_order: parseInt(formData.sort_order) || 0,
    };

    let error;
    if (selectedTutorial) {
      const { error: e } = await supabase.from("tutorials").update(tutorialData).eq("id", selectedTutorial.id);
      error = e;
    } else {
      const { error: e } = await supabase.from("tutorials").insert(tutorialData);
      error = e;
    }

    setSaving(false);
    if (error) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "موفق", description: selectedTutorial ? "ویدیو ویرایش شد" : "ویدیو اضافه شد" });
      setDialogOpen(false);
      setFormData(initialFormData);
      setSelectedTutorial(null);
      fetchTutorials();
    }
  };

  const handleEdit = (t: Tutorial) => {
    setSelectedTutorial(t);
    setFormData({
      title: t.title,
      description: t.description || "",
      video_type: t.video_type,
      video_url: t.video_url,
      thumbnail_url: t.thumbnail_url || "",
      duration: t.duration || "",
      category: t.category || "",
      is_free: t.is_free,
      is_active: t.is_active,
      sort_order: t.sort_order.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTutorial) return;
    const { error } = await supabase.from("tutorials").delete().eq("id", selectedTutorial.id);
    if (error) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "موفق", description: "ویدیو حذف شد" });
      fetchTutorials();
    }
    setDeleteDialogOpen(false);
    setSelectedTutorial(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">مدیریت ویدیوهای آموزشی</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedTutorial(null); setFormData(initialFormData); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 ml-2" />
                افزودن ویدیو
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedTutorial ? "ویرایش ویدیو" : "افزودن ویدیو جدید"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>عنوان *</Label>
                  <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>توضیحات</Label>
                  <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نوع ویدیو *</Label>
                    <Select value={formData.video_type} onValueChange={(v: "embed" | "upload") => setFormData(p => ({ ...p, video_type: v, video_url: "" }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="embed">لینک خارجی (یوتیوب/آپارات)</SelectItem>
                        <SelectItem value="upload">آپلود مستقیم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>دسته‌بندی</Label>
                    <Input value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} placeholder="مثلاً: تحلیل تکنیکال" />
                  </div>
                </div>

                {formData.video_type === "embed" ? (
                  <div className="space-y-2">
                    <Label>لینک ویدیو (YouTube / آپارات) *</Label>
                    <Input value={formData.video_url} onChange={e => setFormData(p => ({ ...p, video_url: e.target.value }))} dir="ltr" placeholder="https://www.youtube.com/watch?v=..." required />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>آپلود ویدیو *</Label>
                    <input ref={fileInputRef} type="file" className="hidden" accept="video/*" onChange={handleFileUpload} />
                    {formData.video_url ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-primary" />
                          <span className="text-sm truncate max-w-[300px]">{formData.video_url.split("/").pop()}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(p => ({ ...p, video_url: "" }))}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" className="w-full h-20 border-dashed" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-5 w-5 ml-2" />انتخاب ویدیو (حداکثر ۱۰۰MB)</>}
                      </Button>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>لینک تصویر بندانگشتی</Label>
                  <Input value={formData.thumbnail_url} onChange={e => setFormData(p => ({ ...p, thumbnail_url: e.target.value }))} dir="ltr" placeholder="https://..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>مدت زمان</Label>
                    <Input value={formData.duration} onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))} placeholder="مثلاً: ۱۵:۳۰" />
                  </div>
                  <div className="space-y-2">
                    <Label>ترتیب نمایش</Label>
                    <Input type="number" value={formData.sort_order} onChange={e => setFormData(p => ({ ...p, sort_order: e.target.value }))} dir="ltr" />
                  </div>
                  <div className="space-y-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.is_free} onCheckedChange={v => setFormData(p => ({ ...p, is_free: v }))} />
                      <Label>رایگان</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.is_active} onCheckedChange={v => setFormData(p => ({ ...p, is_active: v }))} />
                      <Label>فعال</Label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={saving || uploading}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                  {selectedTutorial ? "ذخیره تغییرات" : "افزودن ویدیو"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">عنوان</TableHead>
                <TableHead className="text-right">نوع</TableHead>
                <TableHead className="text-right">دسته‌بندی</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">بازدید</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutorials.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      {t.video_type === "embed" ? <Link className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
                      {t.video_type === "embed" ? "لینک" : "آپلود"}
                    </span>
                  </TableCell>
                  <TableCell>{t.category || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${t.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {t.is_active ? "فعال" : "غیرفعال"}
                    </span>
                  </TableCell>
                  <TableCell>{t.view_count}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedTutorial(t); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {tutorials.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">هیچ ویدیویی یافت نشد</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف ویدیو</AlertDialogTitle>
            <AlertDialogDescription>آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
