CREATE TABLE fruit_basket (
    id SERIAL PRIMARY KEY, 
    fruit_type TEXT NOT NULL,
    qty INTEGER,
    fruit_price FLOAT(2) NOT NULL
);