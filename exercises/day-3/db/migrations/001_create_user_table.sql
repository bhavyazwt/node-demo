create table IF NOT EXISTS users(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    email varchar(255),
    age int,
    role varchar(30),
    isActive BOOL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    primary key(id)
);