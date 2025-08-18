-- Orders + Order Lines schema + RLS (pour Supabase)

-- 1) Tables
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  station_id int4,
  user_id uuid not null,                         -- auth.uid()
  order_type text not null,                      -- 'onplace' | 'delivery' | 'glovo'
  payment_method text not null,                  -- 'cash' | 'card' | 'other'
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status text not null default 'paid'            -- 'paid' | 'void' | ...
);

create table if not exists order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  unit_price numeric(12,2) not null,
  qty int2 not null,
  line_total numeric(12,2) not null
);

-- 2) RLS + policies
alter table orders enable row level security;
alter table order_lines enable row level security;

create policy if not exists "orders_insert_own" on orders
for insert with check (auth.uid() = user_id);

create policy if not exists "orders_select_own" on orders
for select using (auth.uid() = user_id);

create policy if not exists "orders_update_own" on orders
for update using (auth.uid() = user_id);

create policy if not exists "orders_delete_own" on orders
for delete using (auth.uid() = user_id);

create policy if not exists "lines_insert_if_own_order" on order_lines
for insert with check (
  exists (select 1 from orders o where o.id = order_lines.order_id and o.user_id = auth.uid())
);

create policy if not exists "lines_select_if_own_order" on order_lines
for select using (
  exists (select 1 from orders o where o.id = order_lines.order_id and o.user_id = auth.uid())
);
