-- ============================================================
-- WillWinShouldWin — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
-- Stores display names for users
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  email text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'display_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. PICKS TABLE
-- Stores each user's will_win and should_win pick per category
create table if not exists picks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category_id text not null,
  will_win text,
  should_win text,
  updated_at timestamp with time zone default timezone('utc', now()),
  unique(user_id, category_id)
);

-- Index for fast aggregation queries
create index if not exists picks_category_idx on picks(category_id);


-- 3. WINNERS TABLE
-- Admin-populated after the ceremony to enable leaderboard scoring
-- You'll manually insert rows here on March 15 as winners are announced
create table if not exists winners (
  id uuid default gen_random_uuid() primary key,
  category_id text unique not null,
  -- will_win_winner: the actual Oscar winner (used to score "Will Win" picks)
  will_win_winner text,
  -- should_win_winner: not used for auto-scoring (subjective), but reserved
  -- for potential future use. Leave null.
  should_win_winner text,
  updated_at timestamp with time zone default timezone('utc', now())
);


-- 4. ROW LEVEL SECURITY
-- Enable RLS on all tables

alter table profiles enable row level security;
alter table picks enable row level security;
alter table winners enable row level security;

-- Profiles: users can read all, only update their own
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);


-- Picks: users can read all picks (for aggregation), but only write their own
create policy "Picks are viewable by everyone"
  on picks for select using (true);

create policy "Users can insert their own picks"
  on picks for insert with check (auth.uid() = user_id);

create policy "Users can update their own picks"
  on picks for update using (auth.uid() = user_id);

create policy "Users can delete their own picks"
  on picks for delete using (auth.uid() = user_id);


-- Winners: readable by everyone, only writable by service role (admin)
create policy "Winners are viewable by everyone"
  on winners for select using (true);


-- ============================================================
-- HOW TO ENTER WINNERS AFTER THE CEREMONY (March 15)
-- ============================================================
-- Run INSERT statements like these in the SQL editor after each win:
--
-- insert into winners (category_id, will_win_winner) values
--   ('best_picture', 'Sinners')
--   on conflict (category_id) do update set will_win_winner = excluded.will_win_winner;
--
-- insert into winners (category_id, will_win_winner) values
--   ('best_director', 'Ryan Coogler — Sinners')
--   on conflict (category_id) do update set will_win_winner = excluded.will_win_winner;
--
-- The category_id values match exactly what's in the app:
-- best_picture, best_director, best_actor, best_actress,
-- best_supporting_actor, best_supporting_actress,
-- original_screenplay, adapted_screenplay, cinematography,
-- film_editing, original_score, original_song, animated_feature,
-- international_feature, documentary_feature, costume_design,
-- production_design, makeup_hairstyling, sound, visual_effects,
-- casting, animated_short, live_action_short, documentary_short
-- ============================================================
