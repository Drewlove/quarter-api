BEGIN;
\i /Users/Drew/Projects/boilerplate-api/seeds/001.seed.article.sql
\i /Users/Drew/Projects/boilerplate-api/seeds/002.seed.user.sql

COMMIT;

-- SEED ALL, copy and paste: psql -f ~/Projects/boilerplate-api/seeds/seed.all.sql boilerplate;