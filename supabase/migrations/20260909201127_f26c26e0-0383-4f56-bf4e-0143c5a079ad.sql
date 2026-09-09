insert into public.product_collections (product_id, collection_id)
select p.id, c.id from public.products p, public.collections c
where c.handle = 'ethiopian-culture-gifts'
  and p.handle in ('teff-grain-mug','coffee-ceremony-poster','abyssinian-tote','amharic-script-cap')
on conflict do nothing;