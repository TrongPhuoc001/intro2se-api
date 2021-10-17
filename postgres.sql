
CREATE TABLE users(
    _id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type SMALLINT NOT NULL,
    gender VARCHAR(10),
    birth VARCHAR(10)
);

CREATE TABLE subject(
    _id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE courses(
    _id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    creator_id INTEGER NOT NULL,
    subject_id INTEGER,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    day_study SMALLINT NOT NULL,
    max_slot INTEGER NOT NULL,
    fee INTEGER NOT NULL,
    curr_state SMALLINT DEFAULT 0,
    createtime TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_creator
        FOREIGN KEY(creator_id)
            REFERENCES users(_id)
	        ON DELETE CASCADE,
    CONSTRAINT fk_subject
        FOREIGN KEY(subject_id)
            REFERENCES subject(_id)
            ON DELETE SET NULL
);

CREATE TABLE courses_stu(
    _id BIGSERIAL PRIMARY KEY,
    stu_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,

    CONSTRAINT fk_stu   
        FOREIGN KEY(stu_id)
            REFERENCES users(_id)
            ON DELETE CASCADE,
    
    CONSTRAINT fk_cour 
        FOREIGN KEY(course_id)
            REFERENCES courses(_id)
            ON DELETE CASCADE
);
