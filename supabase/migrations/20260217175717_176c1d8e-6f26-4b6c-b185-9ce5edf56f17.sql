
-- Create tutorials table
CREATE TABLE public.tutorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_type TEXT NOT NULL DEFAULT 'embed' CHECK (video_type IN ('embed', 'upload')),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  category TEXT,
  is_free BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- Everyone can view active tutorials
CREATE POLICY "Active tutorials viewable by everyone"
ON public.tutorials FOR SELECT
USING (is_active = true);

-- Admins full access
CREATE POLICY "Admins can insert tutorials"
ON public.tutorials FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tutorials"
ON public.tutorials FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tutorials"
ON public.tutorials FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all tutorials (including inactive)
CREATE POLICY "Admins can view all tutorials"
ON public.tutorials FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_tutorials_updated_at
BEFORE UPDATE ON public.tutorials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for tutorial videos
INSERT INTO storage.buckets (id, name, public) VALUES ('tutorial-videos', 'tutorial-videos', true);

-- Storage policies for tutorial videos
CREATE POLICY "Tutorial videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'tutorial-videos');

CREATE POLICY "Admins can upload tutorial videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tutorial-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tutorial videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'tutorial-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tutorial videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'tutorial-videos' AND has_role(auth.uid(), 'admin'::app_role));
