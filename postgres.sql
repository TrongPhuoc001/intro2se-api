Create or replace function random_color() returns text as
$$
declare
  chars text[] := '{#F6D7A7,#F6EABE,#C8E3D4,#87AAAA,#FEF5ED,#D3E4CD,#ADC2A9,#99A799,#FAEBE0,#C9E4C5,#B5CDA3,#C1AC95,#F2F4D1,#B2D3BE,#89A3B2,#5E6073}';
  result text := '';
  i integer := 0;
begin
    result := chars[1+random()*(array_length(chars, 1)-1)];
	while(SELECT COUNT(*) FROM subject WHERE color=result)
		loop
			result := chars[1+random()*(array_length(chars, 1)-1)];
		end loop;
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
	address VARCHAR(255) DEFAULT 'Viet Nam'
);

create table "admin"(
	_id serial PRIMARY KEY,
	admin_name VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	type VARCHAR(10) NOT NULL
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
	description VARCHAR(255),
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

ALTER TABLE discuss 
	ADD CONSTRAINT FK_Discuss_User 
		FOREIGN KEY (user_id) 
			REFERENCES public."user"(_id)
			ON DELETE CASCADE;
ALTER TABLE discuss ADD 
	CONSTRAINT FK_Discuss_Course 
		FOREIGN KEY (course_id) 
			REFERENCES course(_id)
			ON DELETE CASCADE;

ALTER TABLE course ADD 
	CONSTRAINT FK_Course_Teacher 
		FOREIGN KEY (teacher_id) 
			REFERENCES public."user"(_id)
			ON DELETE CASCADE;
ALTER TABLE course ADD 
	CONSTRAINT FK_Course_Subject 
		FOREIGN KEY (subject_id) 
			REFERENCES subject(_id);

ALTER TABLE course_task ADD 
	CONSTRAINT FK_CourseTask_Course 
		FOREIGN KEY (course_id) 
			REFERENCES course(_id)
			ON DELETE CASCADE;

ALTER TABLE student_course ADD 
	CONSTRAINT FK_StudentCourse_Student 
		FOREIGN KEY (student_id) 
			REFERENCES public."user"(_id)
			ON DELETE CASCADE;

insert into type_user(type_name) values
('teacher'),
('student');

insert into "admin" (admin_name,password,type) 
values ('admin','$2a$10$bS5gC94aIO4eTeb34NXw3OWMjgNZys7QRJJQxqP00g1mLvKof8IWa','admin'),
('phuoc','$2a$10$RuJ.J7QvP095a1BQgpVmSeF5JTobfsDMdyyzPaFvP5gzYxwNb5R.e','maneger'),
('quan','$2a$10$RuJ.J7QvP095a1BQgpVmSeF5JTobfsDMdyyzPaFvP5gzYxwNb5R.e','maneger');


insert into "user" (user_name,password,type,email,gender,birthday,address) 
values 
('Giáo Viên 1','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien1@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Giáo Viên 2','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien2@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Giáo Viên 3','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien3@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Giáo Viên 4','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien4@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Giáo Viên 5','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien5@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 1','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh1@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 2','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh2@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 3','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh3@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 4','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh4@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 5','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh5@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 6','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh6@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 7','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh7@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 8','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh8@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 9','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh9@gmail.com','Nam','2001-04-24','Đắc Lắc'),
('Học Sinh 10','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh10@gmail.com','Nam','2001-04-24','Đắc Lắc');

insert into subject(subject_name) values
('Lập TrÌnh'),
('Hệ thống thông tin'),
('Khoa học máy tính'),
('Mạng Máy tính'),
('Phần Mềm'),
('Trí tuệ nhân tạo'),
('An Toàn Thông Tin'),
('Khoa học dữ liệu'),
('Thiết kế đồ họa'),
('Hệ thống máy tính');

insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(1,'Kĩ Thuật Lập TrÌnh',1,'12:30:00','16:30:00',4,'2021-8-24','2021-12-24','F102',150,3000000,'Môn cơ sở ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(1,'Lập TrÌnh Hướng Đối Tượng',1,'07:30:00','10:30:00',3,'2021-8-24','2021-12-24','F102',150,3000000,' Môn cơ sở ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(2,'Cơ Sở Dữ Liệu',2,'07:30:00','10:30:00',4,'2021-8-24','2021-12-24','F102',150,3000000,'Môn cơ sở ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(2,'Hệ quản trị cơ sở dữ liệu',2,'12:30:00','16:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(3,'Cấu Trúc Dữ Liệu Và Giải Thuật',3,'12:30:00','16:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'Môn cơ sở ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(3,'Độ phức tạp thuật toán',3,'07:30:00','10:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(4,'Mạng Máy Tính',4,'07:30:00','10:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'Môn cơ sở ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(4,'Hệ thống viễn thông',4,'07:30:00','10:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(5,'Nhập Môn Công Nghệ Phần Mềm',1,'07:30:00','10:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(5,'Kiến Trúc Phần Mềm',1,'12:30:00','16:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(6,'Cơ sở trí tuệ nhân tạo',5,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'Môn cơ sở ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(6,'Nhập môn học máy',5,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(7,'Mã hóa ứng dụng',4,'12:30:00','16:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(7,'Nhập môn mã hóa - mật mã',4,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(8,'Nhập môn khoa học dữ liệu',2,'07:30:00','10:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(8,'Khai thác dữ liệu',2,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(9,'Xử lý ảnh số và video số',5,'12:30:00','16:30:00',3,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(9,'Thiết kế đồ họa',5,'07:30:00','10:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'Môn chuyên ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(10,'Hệ Thống Máy Tính',3,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'Môn cơ sở ngành');
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(10,'Hệ Điều Hành',3,'12:30:00','16:30:00',3,'2021-8-24','2021-12-24','F102',150,3000000,'Môn cơ sở ngành');

insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 1 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 2 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 3 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 4 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 5 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 6 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'Làm bài tập 7 trong slide','2021-12-12 00:00:00');

insert into discuss(user_id,course_id,content)values
(6,1,'Mong thầy gửi video record'),
(6,4,'Mong thầy gửi video record'),
(6,7,'Mong thầy gửi video record'),
(6,8,'Mong thầy gửi video record'),
(2,1,'Trên kênh youtube của thầy nha :D'),
(2,4,'Trên kênh youtube của thầy nha :D'),
(2,7,'Trên kênh youtube của thầy nha :D'),
(2,8,'Trên kênh youtube của thầy nha :D');

insert into student_course(student_id,course_id) values
(6,4),
(6,2),
(6,1),
(6,15),
(6,11),
(7,4),
(7,2),
(7,1),
(7,15),
(7,11),
(8,5),(8,20),(8,1),(8,13),(8,12),
(9,5),(9,20),(9,1),(9,13),(9,12),
(10,8),(10,2),(10,1),(10,10),(10,14),
(11,8),(11,2),(11,1),(11,10),(11,14),
(12,9),(12,17),(12,3),(12,7),(12,16),
(13,9),(13,17),(13,3),(13,7),(13,16),
(14,18),(14,17),(14,3),(14,6),(14,19),
(15,18),(15,17),(15,3),(15,6),(15,19);