Create or replace function random_color() returns text as
$$
declare
  chars text[] := '{#F6D7A7,#F6EABE,#C8E3D4,#87AAAA,#FEF5ED,#D3E4CD,#ADC2A9,#99A799,#FAEBE0,#C9E4C5,#B5CDA3,#C1AC95,#F2F4D1,#B2D3BE,#89A3B2,#5E6073}';
  result text := '';
  i integer := 0;
begin
    result := chars[1+random()*(array_length(chars, 1)-1)];
  return result;
end;
$$ language plpgsql;

create table public."user"(
	_id serial PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	user_name VARCHAR(255) NOT NULL,
	type int NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	gender VARCHAR(255) NOT NULL,
	birthday date NOT NULL,
	address VARCHAR(255) DEFAULT 'Việt Nam'
);

create table type_user(
	_id serial PRIMARY KEY,
	type_name VARCHAR(255) NOT NULL
);

create table discuss(
	_id serial PRIMARY KEY,
	user_id int NOT NULL,
	course_id int NOT NULL,
	content VARCHAR(255) NOT NULL
);

create table subject(
	_id serial PRIMARY KEY,
	subject_name VARCHAR(255) NOT NULL UNIQUE,
	color text UNIQUE DEFAULT random_color()
);

create table course(
	_id serial PRIMARY KEY,
	subject_id int NOT NULL,
	course_name VARCHAR(255) NOT NULL,
	teacher_id int NOT NULL,
	time_start time NOT NULL,
	time_end time NOT NULL,
    day_study smallint NOT NULL,
	day_start date NOT NULL,
    day_end date NOT NULL,
	room VARCHAR(255),
	max_slot int NOT NULL,
	fee money NOT NULL,
    curr_state smallint DEFAULT 0,
    create_time timestamp DEFAULT NOW() 
);

create table student_course(
	_id serial PRIMARY KEY,
	student_id int NOT NULL,
	course_id int NOT NULL,
	resign_time timestamp DEFAULT NOW()
);

create table course_task(
	_id serial PRIMARY KEY,
	course_id int NOT NULL,
	content VARCHAR(255) NOT NULL,
	task_endtime timestamp NOT NULL
);

ALTER TABLE public."user" ADD CONSTRAINT FK_User_TypeUser FOREIGN KEY (type) REFERENCES type_user(_id);

ALTER TABLE discuss ADD CONSTRAINT FK_Discuss_User FOREIGN KEY (user_id) REFERENCES public."user"(_id);
ALTER TABLE discuss ADD CONSTRAINT FK_Discuss_Course FOREIGN KEY (course_id) REFERENCES course(_id);

ALTER TABLE course ADD CONSTRAINT FK_Course_Teacher FOREIGN KEY (teacher_id) REFERENCES public."user"(_id);
ALTER TABLE course ADD CONSTRAINT FK_Course_Subject FOREIGN KEY (subject_id) REFERENCES subject(_id);

ALTER TABLE course_task ADD CONSTRAINT FK_CourseTask_Course FOREIGN KEY (course_id) REFERENCES course(_id);

ALTER TABLE student_course ADD CONSTRAINT FK_StudentCourse_Student FOREIGN KEY (student_id) REFERENCES public."user"(_id);

insert into type_user(type_name) values
('admin'),
('teacher'),
('student');

insert into "user" (user_name,password,type,email,gender,birthday,address) 
values ('Admin','admin',1,'admin@gmail.com','Bi','2001-01-01','HCMUS');

insert into "user" (user_name,password,type,email,gender,birthday,address) 
values 
('Giáo Viên 1','giaovien1',2,'giaovien1@gmail.com','Nam','2001-24-04','Đắc Lắc'),
('Giáo Viên 2','giaovien2',2,'giaovien2@gmail.com','Nam','2001-24-04','Đắc Lắc'),
('Giáo Viên 3','giaovien2',2,'giaovien3@gmail.com','Nam','2001-24-04','Đắc Lắc'),
('Học Sinh 1','hocsinh1',3,'hocsinh1@gmail.com','Nam','2001-24-04','Đắc Lắc'),
('Học Sinh 2','hocsinh2',3,'hocsinh2@gmail.com','Nam','2001-24-04','Đắc Lắc'),
('Học Sinh 3','hocsinh3',3,'hocsinh3@gmail.com','Nam','2001-24-04','Đắc Lắc');

insert into subject(subject_name) values
('Lập Trình/Programing'),
('Khoa học máy tính/Computer Science'),
('Mạng Máy tính/Network'),
('Dữ Liệu/Data'),
('Phần Mềm/Software'),
('Trí tuệ nhân tạo/AI');

insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee) values
(1,'Nhập Môn Lập Trình 1',2,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(1,'Nhập Môn Lập Trình 2',3,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(1,'Nhập Môn Lập Trình 3',4,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(1,'Kĩ Thuật Lập Trình 1',2,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(1,'Kĩ Thuật Lập Trình 2',3,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(1,'Kĩ Thuật Lập Trình 3',4,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(1,'Lập Trình Hướng Đối Tượng 1',2,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(1,'Lập Trình Hướng Đối Tượng 2',3,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(1,'Lập Trình Hướng Đối Tượng 3',4,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(2,'Cấu Trúc Dữ Liệu Và Giải Thuật 1',2,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(2,'Cấu Trúc Dữ Liệu Và Giải Thuật 2',3,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(2,'Cấu Trúc Dữ Liệu Và Giải Thuật 3',4,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(3,'Mạng Máy Tính 1',2,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(3,'Mạng Máy Tính 2',3,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(3,'Mạng Máy Tính 3',4,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(2,'Hệ Thống Máy Tính 1',2,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(2,'Hệ Thống Máy Tính 2',3,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(2,'Hệ Thống Máy Tính 3',4,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(4,'Cơ Sở Dữ Liệu 1',2,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(4,'Cơ Sở Dữ Liệu 2',3,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(4,'Cơ Sở Dữ Liệu 3',4,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(2,'Hệ Điều Hành 1',2,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(2,'Hệ Điều Hành 2',3,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(2,'Hệ Điều Hành 3',4,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000),
(5,'Nhập Môn Công Nghệ Phần Mềm 1',2,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000),
(5,'Nhập Môn Công Nghệ Phần Mềm 2',3,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F202',150,3000000),
(5,'Nhập Môn Công Nghệ Phần Mềm 3',4,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F302',150,3000000);

insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 1 trong slide','2021-12-12 00:00:00'),
(2,'Làm bài tập 2 trong slide','2021-12-12 00:00:00'),
(3,'Làm bài tập 3 trong slide','2021-12-12 00:00:00'),
(4,'Làm bài tập 4 trong slide','2021-12-12 00:00:00'),
(5,'Làm bài tập 5 trong slide','2021-12-12 00:00:00'),
(6,'Làm bài tập 6 trong slide','2021-12-12 00:00:00'),
(7,'Làm bài tập 7 trong slide','2021-12-12 00:00:00');

insert into discuss(user_id,course_id,content)values
(5,1,'Mong thầy gửi video record'),
(5,4,'Mong thầy gửi video record'),
(5,7,'Mong thầy gửi video record'),
(5,8,'Mong thầy gửi video record'),
(2,1,'Trên kênh youtube của thầy nha :D'),
(2,4,'Trên kênh youtube của thầy nha :D'),
(2,7,'Trên kênh youtube của thầy nha :D'),
(2,8,'Trên kênh youtube của thầy nha :D');

insert into student_course(student_id,course_id,resign_time) values
(5,1,'2021-10-10 00:00:00'),
(5,4,'2021-10-10 00:00:00'),
(5,7,'2021-10-10 00:00:00'),
(5,8,'2021-10-10 00:00:00'),
(6,2,'2021-10-10 00:00:00'),
(6,5,'2021-10-10 00:00:00'),
(6,8,'2021-10-10 00:00:00'),
(6,10,'2021-10-10 00:00:00'),
(7,3,'2021-10-10 00:00:00'),
(7,6,'2021-10-10 00:00:00'),
(7,9,'2021-10-10 00:00:00'),
(7,10,'2021-10-10 00:00:00');

