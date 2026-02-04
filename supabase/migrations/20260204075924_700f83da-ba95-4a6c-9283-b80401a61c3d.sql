-- Create storage bucket for digital products
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for product-files bucket
-- Admins can upload files
CREATE POLICY "Admins can upload product files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can update files
CREATE POLICY "Admins can update product files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete files
CREATE POLICY "Admins can delete product files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Users who purchased can download files
CREATE POLICY "Purchasers can download product files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product-files' 
  AND (
    -- Admins can always access
    has_role(auth.uid(), 'admin'::app_role)
    OR
    -- Users who have paid orders containing this product
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.user_id = auth.uid()
      AND o.status IN ('paid', 'processing', 'shipped', 'delivered')
      AND p.file_url LIKE '%' || storage.objects.name
    )
  )
);