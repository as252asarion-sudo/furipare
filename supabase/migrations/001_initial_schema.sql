-- profilesテーブル
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  plan text not null default 'free',
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- clientsテーブル
create table clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  email text,
  address text,
  created_at timestamptz default now()
);

-- invoicesテーブル
create table invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients,
  status text default 'draft',
  issue_date date,
  due_date date,
  total_amount integer default 0,
  data jsonb,
  created_at timestamptz default now()
);

-- quotesテーブル
create table quotes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references clients,
  data jsonb,
  created_at timestamptz default now()
);

-- contractsテーブル
create table contracts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  data jsonb,
  created_at timestamptz default now()
);

-- RLS有効化
alter table profiles enable row level security;
alter table clients enable row level security;
alter table invoices enable row level security;
alter table quotes enable row level security;
alter table contracts enable row level security;

-- RLSポリシー
create policy "users can manage own profile" on profiles for all using (auth.uid() = id);
create policy "users can manage own clients" on clients for all using (auth.uid() = user_id);
create policy "users can manage own invoices" on invoices for all using (auth.uid() = user_id);
create policy "users can manage own quotes" on quotes for all using (auth.uid() = user_id);
create policy "users can manage own contracts" on contracts for all using (auth.uid() = user_id);

-- ユーザー作成時にprofilesを自動生成するトリガー
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
