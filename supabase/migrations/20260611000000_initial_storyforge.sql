create table if not exists public.users (
  id text primary key,
  email text not null unique,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  user_id text not null unique references public.users(id) on delete cascade,
  display_name text,
  preferred_worlds jsonb,
  language text not null default 'es',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.worlds (
  id text primary key,
  name text not null,
  description text not null,
  tone text not null,
  rules jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_inputs (
  id text primary key,
  user_id text references public.users(id) on delete set null,
  world_id text not null references public.worlds(id),
  kind text not null,
  raw_text text not null,
  safety_status text not null default 'ok',
  created_at timestamptz not null default now()
);

create index if not exists story_inputs_world_id_idx on public.story_inputs(world_id);
create index if not exists story_inputs_user_id_idx on public.story_inputs(user_id);

create table if not exists public.narrative_extractions (
  id text primary key,
  input_id text not null unique references public.story_inputs(id) on delete cascade,
  main_conflict text not null,
  protagonist_goal text not null,
  emotions jsonb not null,
  relationships jsonb not null,
  core_essence text not null,
  narrative_stakes text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.story_sessions (
  id text primary key,
  user_id text references public.users(id) on delete set null,
  input_id text not null references public.story_inputs(id) on delete cascade,
  world_id text not null references public.worlds(id),
  title text not null,
  premise text not null,
  status text not null default 'active',
  current_scene_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists story_sessions_user_id_idx on public.story_sessions(user_id);
create index if not exists story_sessions_world_id_idx on public.story_sessions(world_id);
create index if not exists story_sessions_input_id_idx on public.story_sessions(input_id);

create table if not exists public.characters (
  id text primary key,
  story_session_id text not null references public.story_sessions(id) on delete cascade,
  name text not null,
  role text not null,
  archetype text not null,
  motivation text not null,
  fear text not null,
  relation_to_protagonist text not null,
  traits jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists characters_story_session_id_idx on public.characters(story_session_id);

create table if not exists public.character_states (
  id text primary key,
  character_id text not null unique references public.characters(id) on delete cascade,
  trust integer not null default 0,
  tension integer not null default 0,
  loyalty integer not null default 0,
  suspicion integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.scenes (
  id text primary key,
  story_session_id text not null references public.story_sessions(id) on delete cascade,
  index integer not null,
  title text not null,
  narration text not null,
  dialogue jsonb not null,
  reactions jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists scenes_story_session_id_idx on public.scenes(story_session_id);

create table if not exists public.choices (
  id text primary key,
  story_session_id text not null references public.story_sessions(id) on delete cascade,
  scene_id text not null references public.scenes(id) on delete cascade,
  label text not null,
  description text not null,
  narrative_intent text not null,
  predicted_consequence text not null,
  created_at timestamptz not null default now()
);

create index if not exists choices_story_session_id_idx on public.choices(story_session_id);
create index if not exists choices_scene_id_idx on public.choices(scene_id);

create table if not exists public.decision_events (
  id text primary key,
  story_session_id text not null references public.story_sessions(id) on delete cascade,
  scene_id text not null references public.scenes(id) on delete cascade,
  choice_id text not null references public.choices(id) on delete cascade,
  consequence_summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists decision_events_story_session_id_idx on public.decision_events(story_session_id);

create table if not exists public.story_memory (
  id text primary key,
  story_session_id text not null unique references public.story_sessions(id) on delete cascade,
  facts jsonb not null,
  unresolved_conflicts jsonb not null,
  relationship_changes jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.story_sessions
  add constraint story_sessions_current_scene_id_fkey
  foreign key (current_scene_id) references public.scenes(id) on delete set null;

