-- Create portfolio table
create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  discipline text not null,
  subcategory text not null,
  year text not null,
  image_url text not null,
  link text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.portfolio enable row level security;

-- Create policies for portfolio table
create policy "Public read access"
  on public.portfolio for select
  using (true);

create policy "Admin full access"
  on public.portfolio for all
  using (auth.role() = 'authenticated');


-- Create storage bucket
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

create policy "Admin Insert"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

create policy "Admin Update"
  on storage.objects for update
  using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

create policy "Admin Delete"
  on storage.objects for delete
  using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );
