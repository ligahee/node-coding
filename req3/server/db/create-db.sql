CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_color VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    photo_url TEXT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment TEXT NOT NULL,
    date_comment TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    story_id INT NOT NULL,
    FOREIGN KEY(story_id) REFERENCES stories(id),
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    PRIMARY KEY(story_id, user_id)
);