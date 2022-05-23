CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_color VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    photo_url TEXT,
    story_id INT NOT NULL,
    FOREIGN KEY(story_id) REFERENCES stories(id)
);