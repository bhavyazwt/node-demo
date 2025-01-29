create table IF NOT EXISTS users_data(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    email varchar(255),
    age int,
    role varchar(30),
    isActive BOOL,
    pdf varchar(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    primary key(id)
);