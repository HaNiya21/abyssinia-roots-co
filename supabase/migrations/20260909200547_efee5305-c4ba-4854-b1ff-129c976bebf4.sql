UPDATE public.products SET supplier_product_code = 'STTU169-BLK-M' WHERE handle IN ('habesha-heritage-tee', 'ethiopian-wolf-tee');
UPDATE public.products SET supplier_product_code = 'JH001-JBK-M' WHERE handle = 'roots-coffee-hoodie';
UPDATE public.products SET supplier_product_code = 'JH030-JBK-M' WHERE handle = 'lalibela-sweatshirt';
UPDATE public.products SET supplier_product_code = 'BB15-BLK' WHERE handle = 'amharic-script-cap';
UPDATE public.products SET supplier_product_code = 'STAU760-BLK' WHERE handle = 'abyssinian-tote';
UPDATE public.products SET supplier_product_code = 'MUG' WHERE handle = 'teff-grain-mug';
UPDATE public.products SET supplier_product_code = 'P-MATTE-AP-A4' WHERE handle = 'coffee-ceremony-poster';
UPDATE public.product_variants v SET supplier_product_code = p.supplier_product_code FROM public.products p WHERE v.product_id = p.id AND p.supplier_product_code IS NOT NULL;