
-- \c postgres;

-- DROP DATABASE tradygrade;
-- CREATE DATABASE tradygrade;
-- \c tradygrade;

CREATE TABLE IF NOT EXISTS users(
user_id SERIAL PRIMARY KEY NOT NULL,
user_name VARCHAR(50) NOT NULL,
user_password VARCHAR(200) NOT NULL,
user_email VARCHAR(99) NOT NULL,
user_picture VARCHAR(240),
refresh_token TEXT
);

ALTER TABLE users ADD CONSTRAINT username_unique UNIQUE (user_name);
ALTER TABLE users ADD CONSTRAINT email_unique UNIQUE (user_email);

CREATE TABLE IF NOT EXISTS chat(
    chat_id SERIAL PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS chatter(
    chatter_id SERIAL PRIMARY KEY NOT NULL,
    chatter_user_id INT NOT NULL,
    chatter_chat_id INT NOT NULL,
    FOREIGN KEY (chatter_user_id) REFERENCES users(user_id),
    FOREIGN KEY (chatter_chat_id) REFERENCES chat(chat_id)
    );


CREATE TABLE IF NOT EXISTS msg(
msg_id SERIAL PRIMARY KEY NOT NULL,
msg_user_id INT NOT NULL,
msg_chat_id INT NOT NULL,
msg_timestamp DATE DEFAULT CURRENT_DATE NOT NULL,
msg_text text,
    FOREIGN KEY (msg_user_id) REFERENCES users(user_id),
    FOREIGN KEY (msg_chat_id) REFERENCES chat(chat_id)
    );

CREATE TABLE IF NOT EXISTS item(
    item_id SERIAL PRIMARY KEY NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    item_description TEXT,
    item_sold BOOLEAN DEFAULT FALSE,
    item_seller_id INT NOT NULL,
    item_category VARCHAR(99),
    item_price FLOAT NOT NULL,
    item_listed_at DATE DEFAULT CURRENT_DATE NOT NULL,
    item_expires DATE,
    item_condition VARCHAR(50),
    item_picture VARCHAR(240),
    FOREIGN KEY (item_seller_id) REFERENCES users(user_id)
);

