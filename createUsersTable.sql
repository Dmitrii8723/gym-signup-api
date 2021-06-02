CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users(
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	fname VARCHAR (50) NOT NULL,
    lname VARCHAR (50) NOT NULL,
    email_verified BOOLEAN NOT NULL,
    email VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    token VARCHAR (255),
	created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

