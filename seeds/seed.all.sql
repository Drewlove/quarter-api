BEGIN;
    \i /Users/Drew/Projects/quarter-api/seeds/001.seed.department.sql
    \i /Users/Drew/Projects/quarter-api/seeds/002.seed.role.sql
    \i /Users/Drew/Projects/quarter-api/seeds/003.seed.shift.sql

    COMMIT;

-- SEED ALL, copy and paste: psql -f ~/Projects/quarter-api/seeds/seed.all.sql quarter;