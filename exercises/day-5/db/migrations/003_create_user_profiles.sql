create table IF NOT EXISTS user_profiles(
    id int NOT NULL AUTO_INCREMENT, 
    userId int,
    bio  varchar(255),
    linkedInUrl  varchar(255),
    facebookUrl  varchar(100),
    instaUrl  varchar(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    primary key(id),
    foreign key (userId) references users(id)
);