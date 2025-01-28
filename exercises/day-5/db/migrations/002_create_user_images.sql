create table IF NOT EXISTS user_images(
    id int NOT NULL AUTO_INCREMENT, 
    userId int,
    imageName varchar(255),
    path varchar(255),
    mimeType varchar(100),
    extension varchar(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    primary key(id),
    foreign key (userId) references users(id)
);