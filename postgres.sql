Create or replace function random_color() returns text as
$$
declare
  chars text[] := '{#E4EDFF,#C1F5FF,#93FFFF,#8AFFE2,#B6FFA8,#A7FCF8,#9CFFE2,#ABFFC0,#E5DFF5,#FFD9F8,#FFDDB6,#FFD1E2,#FFD1B7,#FFD2EA,#FFCFCC,#97FFD0,#8CFFEB}';
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
	address VARCHAR(255) DEFAULT 'Viet Nam',
	status BOOLEAN DEFAULT t,
	verify BOOLEAN DEFAULT f
);

create table "admin"(
	_id serial PRIMARY KEY,
	admin_name VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	type VARCHAR(10) NOT NULL,
	status BOOLEAN NOT NULL
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
    create_time timestamp DEFAULT NOW(),
	status BOOLEAN NOT NULL,
	requirement TEXT
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

insert into "admin" (admin_name,password,type,status) 
values ('admin','$2a$10$bS5gC94aIO4eTeb34NXw3OWMjgNZys7QRJJQxqP00g1mLvKof8IWa','admin',true),
('phuoc','$2a$10$RuJ.J7QvP095a1BQgpVmSeF5JTobfsDMdyyzPaFvP5gzYxwNb5R.e','maneger',true),
('quan','$2a$10$RuJ.J7QvP095a1BQgpVmSeF5JTobfsDMdyyzPaFvP5gzYxwNb5R.e','maneger',true);


insert into "user" (user_name,password,type,email,gender,birthday,address,status) 
values 
('Gi??o Vi??n 1','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien1@gmail.com','Nam','2001-04-24','?????c L???c',true),
('Gi??o Vi??n 2','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien2@gmail.com','Nam','2001-04-24','?????c L???c',true),
('Gi??o Vi??n 3','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien3@gmail.com','Nam','2001-04-24','?????c L???c',true),
('Gi??o Vi??n 4','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien4@gmail.com','Nam','2001-04-24','?????c L???c',true),
('Gi??o Vi??n 5','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',1,'giaovien5@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 1','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh1@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 2','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh2@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 3','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh3@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 4','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh4@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 5','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh5@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 6','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh6@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 7','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh7@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 8','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh8@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 9','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh9@gmail.com','Nam','2001-04-24','?????c L???c',true),
('H???c Sinh 10','$2a$10$sHlHBUs1Eh5e2vrlYfEsgOoW6KM/ZyzHgNRSCq2c7FI2OcUGkv6s6',2,'hocsinh10@gmail.com','Nam','2001-04-24','?????c L???c',true);

insert into subject(subject_name) values
('L???p Tr??nh'),
('H??? th???ng th??ng tin'),
('Khoa h???c m??y t??nh'),
('M???ng M??y t??nh'),
('Ph???n M???m'),
('Tr?? tu??? nh??n t???o'),
('An To??n Th??ng Tin'),
('Khoa h???c d??? li???u'),
('Thi???t k??? ????? h???a'),
('H??? th???ng m??y t??nh');

insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description,status) values
(1,'K?? Thu???t L???p Tr??nh',1,'12:30:00','16:30:00',4,'2021-8-24','2021-12-24','F102',150,3000000,'M??n c?? s??? ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(1,'L???p Tr??nh H?????ng ?????i T?????ng',1,'07:30:00','10:30:00',3,'2021-8-24','2021-12-24','F102',150,3000000,' M??n c?? s??? ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(2,'C?? S??? D??? Li???u',2,'07:30:00','10:30:00',4,'2021-8-24','2021-12-24','F102',150,3000000,'M??n c?? s??? ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(2,'H??? qu???n tr??? c?? s??? d??? li???u',2,'12:30:00','16:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(3,'C???u Tr??c D??? Li???u V?? Gi???i Thu???t',3,'12:30:00','16:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'M??n c?? s??? ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(3,'????? ph???c t???p thu???t to??n',3,'07:30:00','10:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(4,'M???ng M??y T??nh',4,'07:30:00','10:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'M??n c?? s??? ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(4,'H??? th???ng vi???n th??ng',4,'07:30:00','10:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(5,'Nh???p M??n C??ng Ngh??? Ph???n M???m',1,'07:30:00','10:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(5,'Ki???n Tr??c Ph???n M???m',1,'12:30:00','16:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(6,'C?? s??? tr?? tu??? nh??n t???o',5,'07:30:00','10:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'M??n c?? s??? ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(6,'Nh???p m??n h???c m??y',5,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(7,'M?? h??a ???ng d???ng',4,'12:30:00','16:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(7,'Nh???p m??n m?? h??a - m???t m??',4,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(8,'Nh???p m??n khoa h???c d??? li???u',2,'07:30:00','10:30:00',5,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(8,'Khai th??c d??? li???u',2,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(9,'X??? l?? ???nh s??? v?? video s???',5,'12:30:00','16:30:00',3,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(9,'Thi???t k??? ????? h???a',5,'07:30:00','10:30:00',2,'2021-8-24','2021-12-24','F102',150,3000000,'M??n chuy??n ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(10,'H??? Th???ng M??y T??nh',3,'12:30:00','16:30:00',6,'2021-8-24','2021-12-24','F102',150,3000000,'M??n c?? s??? ng??nh',true);
insert into course(subject_id,course_name,teacher_id,time_start,time_end,day_study,day_start,day_end,room,max_slot,fee,description) values
(10,'H??? ??i???u H??nh',3,'12:30:00','16:30:00',3,'2021-8-24','2021-12-24','F102',150,3000000,'M??n c?? s??? ng??nh',true);

insert into course_task(course_id,content,task_endtime) values
(1,'L??m b??i t???p 1 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'L??m b??i t???p 2 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'L??m b??i t???p 3 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'L??m b??i t???p 4 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'L??m b??i t???p 5 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'L??m b??i t???p 6 trong slide','2021-12-12 00:00:00');
insert into course_task(course_id,content,task_endtime) values
(1,'L??m b??i t???p 7 trong slide','2021-12-12 00:00:00');

insert into discuss(user_id,course_id,content)values
(6,1,'Mong th???y g???i video record'),
(6,4,'Mong th???y g???i video record'),
(6,7,'Mong th???y g???i video record'),
(6,8,'Mong th???y g???i video record'),
(2,1,'Tr??n k??nh youtube c???a th???y nha :D'),
(2,4,'Tr??n k??nh youtube c???a th???y nha :D'),
(2,7,'Tr??n k??nh youtube c???a th???y nha :D'),
(2,8,'Tr??n k??nh youtube c???a th???y nha :D');

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