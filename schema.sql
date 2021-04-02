DROP TABLE IF EXISTS TABLES;
CREATE TABLE TABLES (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(255),
    location  VARCHAR(255),
    latitude  VARCHAR(255),
    longitude VARCHAR(255)
);