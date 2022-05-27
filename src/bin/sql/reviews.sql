CREATE TABLE members(
    id serial,
    name character varying(50),
    email text,
    password text,
    favorite_movies text[]
);

CREATE TABLE movies(
    id serial,
    image_path text,
    title character varying(50),
    overview text,
    release_date date,
    vote real
);

CREATE TABLE reviews(
    id serial,
    reviewer character varying(50),
    movie character varying(50),
    rate real,
    review text
);

CREATE TABLE likes(
    member character varying(50),
    review int
);

INSERT INTO members(name, email, password, favorite_movies)
VALUES
('alice', 'alice@test.com', 'alicebeck', '{Frozen}'),
('josh', 'josh@test.com', 'joshparker', '{Spider-Man}');

INSERT INTO movies(image_path, title, overview, release_date, vote)
VALUES
('', 'Frozen', 'The film depicts a princess who sets off on a journey alongside an iceman, his reindeer, and a snowman to find her estranged sister, whose icy powers have inadvertently trapped their kingdom in eternal winter.', '2013-11-27', 3.8);

INSERT INTO reviews(reviewer, movie, rate, review)
VALUES
('alice', 'Frozen', 4.5, 'It is genuinely a delightful experience; full of memorable songs and fun moments & lots of dry humour.');

INSERT INTO likes(member, review)
VALUES
('josh', 1);