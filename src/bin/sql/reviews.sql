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
    rid serial,
    reviewer character varying(50),
    movie character varying(50),
    rate real,
    review_comment text
);

CREATE TABLE likes(
    member character varying(50),
    review int
);

INSERT INTO members(name, email, password, favorite_movies)
VALUES
('alice', 'alice@test.com', 'alicebeck', '{Frozen}'),
('josh', 'josh@test.com', 'joshparker', '{SPIDER-MAN}');

INSERT INTO movies(image_path, title, overview, release_date, vote)
VALUES
('https://i.pinimg.com/originals/4f/e0/5c/4fe05c0a2d170a2261e6501618f913bd.png', 'Frozen', 'The film depicts a princess who sets off on a journey alongside an iceman, his reindeer, and a snowman to find her estranged sister, whose icy powers have inadvertently trapped their kingdom in eternal winter.', '2013-11-27', 3.8),
('https://wallpaperaccess.com/full/35386.jpg', 'SPIDER-MAN', '"Spider-Man" centers on student Peter Parker (Tobey Maguire) who, after being bitten by a genetically-altered spider, gains superhuman strength and the spider-like ability to cling to any surface. He vows to use his abilities to fight crime, coming to understand the words of his beloved Uncle Ben: "With great power comes great responsibility."', '2002-05-03', 4.1);

INSERT INTO reviews(reviewer, movie, rate, review_comment)
VALUES
('alice', 'Frozen', 4.5, 'It is genuinely a delightful experience; full of memorable songs and fun moments & lots of dry humour.');

INSERT INTO likes(member, review)
VALUES
('josh', 1);