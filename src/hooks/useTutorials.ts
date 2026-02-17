import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tutorial {
  id: string;
  title: string;
  description: string | null;
  video_type: 'embed' | 'upload';
  video_url: string;
  thumbnail_url: string | null;
  duration: string | null;
  category: string | null;
  is_free: boolean;
  is_active: boolean;
  sort_order: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export function useTutorials(options: { category?: string; limit?: number } = {}) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase
        .from('tutorials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (options.category) query = query.eq('category', options.category);
      if (options.limit) query = query.limit(options.limit);

      const { data } = await query;
      setTutorials((data as Tutorial[]) || []);
      setLoading(false);
    };
    fetch();
  }, [options.category, options.limit]);

  return { tutorials, loading };
}
