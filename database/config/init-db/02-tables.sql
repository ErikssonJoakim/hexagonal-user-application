USE test;

CREATE TABLE IF NOT EXISTS users (
    user_id INT(6) UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(80) NOT NULL UNIQUE,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    updated_at DATETIME ON UPDATE NOW(),
    PRIMARY KEY (user_id)
);