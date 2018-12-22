create table if not exists users (
  "id" serial,
  "name" varchar(150) not null,
  "username" varchar(50) not null,
  "updatedAt" timestamp not null default now(),
  "createdAt" timestamp not null default now()
);
