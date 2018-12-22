create table if not exists users (
  "id" serial,
  "name" varchar(150) not null,
  "username" varchar(50) not null,
  "updated_at" timestamp not null default now(),
  "created_at" timestamp not null default now()
);
