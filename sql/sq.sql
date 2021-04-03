DROP TABLE IF EXISTS TABLES ;

CREATE TABLE TABLES (
    id SERIAL PRIMARY KEY,
    search_query   VARCHAR(225),
  formatted_query VARCHAR(225),
  latitude VARCHAR(225),
  longitude VARCHAR(225)
   )

