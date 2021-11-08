Welcome to intro2se-api :)  link github : 'https://github.com/TrongPhuoc001/intro2se-api '

# Routes

## User routes

Main url : 'http://intro2se-api.herokuapp.com/user '

### Register

Url : 'http://intro2se-api.herokuapp.com/user/register '   
Method : POST

```javascript
fetch("http://intro2se-api.herokuapp.com/user/register", {
  header: {
    "Content-Type": "application/json",
  },
  method: POST,
  body: {
    name: "Nguyễn Trọng Phước",
    email: "phuoc@pmail.com",
    password: "phuoc1903",
    type: 1,
    gender: "male",
    birthday: "2001-03-19",
  },
});
```

Response :
All error in status 400

```javascript
//email already been taken error
{
    "message": "email has already been taken"
}
// info validation error
{
    "message": "\"name\" length must be at least 6 characters long"
}
{
    "message": "\"email\" must be a valid email"
}
{
    "message": "\"password\" length must be at least 6 characters long"
}
//...
```

Create success will get response in status 200 and message

```javascript
{
    "message": "Account create successful"
}
```

### Login

Url : 'http://intro2se-api.herokuapp.com/user/login '

```javascript
fetch("http://intro2se-api.herokuapp.com/user/login", {
  header: {
    "Content-Type": "application/json",
  },
  method: POST,
  body: { email: "phuochs@pmail.com", password: "phuoc1903" },
});
```

token in Response.header :

```javascript
"Auth" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzIiwidHlwZSI6MiwiaWF0IjoxNjM0NjUxMTY3fQ.e4ujo04URPb0LMcCJNfURebeUFzz3kI3heQoLdHCDfM"
```

Response.body :  

```javascript
{
    "message": "Login successful!",
    "user": {
        "_id": "3",
        "name": "Phước học sinh",
        "email": "phuochs@pmail.com",
        "password": "$2a$10$2zjjzTfrftmx5i0dsu1soOM7Sxvzzl4sBc85ayS/eFqoQXEc3bVuy",
        "type": 2,
        "gender": "male",
        "birthday": "2001-03-18T17:00:00.000Z",,
        "address": "Viet Nam"
    }
}
```

add token in request.header with "auth" key for other user and course api  

### User course

URL : 'http://intro2se-api.herokuapp.com/user/:user_id/courses '  
TOKEN require  
add token in header  
Example  

```javascript
fetch("http://intro2se-api.herokuapp.com/user/3/courses", {
  header: {
    auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjMsInR5cGUiOjIsImlhdCI6MTYzNTk4Nzg4N30.5G8SzB6aO-35hQ1rQgBKYOAX5x8f6Xkb2f3gyh8bKHg",
  },
});
```

Error not add token or token not match user_id, response status = 401

```javascript
{
    "message": "Access denied"
}
```

Get success  
RESPONSE
```javascript
[
<<<<<<< HEAD
    {
        "course_name": "Nhập Môn Lập Trình",
        "subject_id": 1,
        "time_start": "07:30:00",
        "time_end": "11:30:00",
        "day_study": 2
    },
    {
        "course_name": "Cơ sở dữ liệu",
        "subject_id": 2,
        "time_start": "07:30:00",
        "time_end": "11:00:00",
        "day_study": 3
    }
]
```

### Delete user

URL : "http://intro2se-api.herokuapp.com/user/delete "  
METHOD : DELETE  
TOKEN require  

## Course route

### All courses

URL : "http://intro2se-api.herokuapp.com/course/all?page=... "  
{?page} is OPTIONAL, 0 by DEFAULT  

OUT PUT  
```javascript
[
    {
        "_id": 1,
        "course_name": "Nhập Môn Lập Trình",
        "subject_id": 1,
        "time_start": "07:30:00",
        "time_end": "11:30:00",
        "day_study": 2,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-08-23T17:00:00.000Z",
        "max_slot": 100,
        "fee": "$1,000,000.00",
        "curr_state": 1
    },
    {
        "_id": 2,
        "course_name": "Cơ sở dữ liệu",
        "subject_id": 2,
        "time_start": "07:30:00",
        "time_end": "11:00:00",
        "day_study": 3,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-12-23T17:00:00.000Z",
        "max_slot": 100,
        "fee": "$1,000,000.00",
        "curr_state": 0
    }
]
```
### Start course  
URL: "http://intro2se-api.herokuapp.com/course/:user_id/start?courseId=:course_id "  
TOKEN REQUIRE  
METHOD : PUT  

REQUEST  
```javascript
fetch("http://intro2se-api.herokuapp.com/course/1/start?courseId=1", {
  header: {
    auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjMsInR5cGUiOjIsImlhdCI6MTYzNTk4Nzg4N30.5G8SzB6aO-35hQ1rQgBKYOAX5x8f6Xkb2f3gyh8bKHg",
  },
});
```

PUT SUCCESS  
```javascript
{
    "message": "Course start"
}
```

### Available courses

URL : "http://intro2se-api.herokuapp.com/course/available?page=... "   

{?page} is optional, 0 by DEFAULT  

OUT PUT  
```javascript
[
    {
        "_id": 2,
        "course_name": "Cơ sở dữ liệu",
        "subject_id": 2,
        "time_start": "07:30:00",
        "time_end": "11:00:00",
        "day_study": 3,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-12-23T17:00:00.000Z",
        "fee": "$1,000,000.00"
    }
]
```

### Search availble by course_name  
URL : "http://intro2se-api.herokuapp.com/course/search?q=:searchString&page=... "   
{q} : empty string by DEFAULT => get all availble course  
{page} : OPTIONAL, 0 by DEFAULT  

Example  
REQUEST  
```javascript
fetch("http://intro2se-api.herokuapp.com/course/search?q=lập ");
```

OUT PUT  
```javascript
[
    {
        "_id": 4,
        "course_name": "Kĩ Thuật Lập Trình",
        "subject_id": 1,
        "time_start": "12:30:00",
        "time_end": "16:30:00",
        "day_study": 6,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-12-23T17:00:00.000Z",
        "fee": "$3,000,000.00"
    },
    {
        "_id": 5,
        "course_name": "Lập Trình Hướng Đối Tượng",
        "subject_id": 1,
        "time_start": "07:30:00",
        "time_end": "10:30:00",
        "day_study": 6,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-12-23T17:00:00.000Z",
        "fee": "$3,000,000.00"
    },
    {
        "_id": 1,
        "course_name": "Nhập Môn Lập Trình",
        "subject_id": 1,
        "time_start": "07:30:00",
        "time_end": "11:30:00",
        "day_study": 2,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-08-23T17:00:00.000Z",
        "fee": "$1,000,000.00"
    }
]
```

### Search by subject 
URL : "http://intro2se-api.herokuapp.com/course/search/subject?q=:subjectId&page=... "  
{q} subject id REQUIRE    
{page} OPTIONAL, 0 by DEFAULT  

Example  
REQUEST  
```javascript
fetch("http://intro2se-api.herokuapp.com/course/search/subject?q=3 ");
```

OUT PUT  
```javascript
[
    {
        "_id": 8,
        "course_name": "Hệ Thống Máy Tính",
        "subject_id": 3,
        "time_start": "12:30:00",
        "time_end": "16:30:00",
        "day_study": 6,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-12-23T17:00:00.000Z",
        "fee": "$3,000,000.00"
    },
    {
        "_id": 9,
        "course_name": "Hệ Điều Hành",
        "subject_id": 3,
        "time_start": "12:30:00",
        "time_end": "16:30:00",
        "day_study": 6,
        "day_start": "2021-08-23T17:00:00.000Z",
        "day_end": "2021-12-23T17:00:00.000Z",
        "fee": "$3,000,000.00"
    }
]
```
### Sign in a course

URL : "http://intro2se-api.herokuapp.com/course/:user_id/sign "  
METHOD : POST  
TOKEN require

#### If user type 1 aka teacher

this api will create a new course

```javascript
fetch("http://intro2se-api.herokuapp.com/course/1/sign", {
  header: {
    "Content-Type": "application/json",
    auth: "bla..blaa..",
  },
  method: POST,
  body: {
    "course_name": "Cơ sở dữ liệu", 
    "subject_id": 2, 
    "time_start": "07:30", 
    "time_end":"11:00", 
    "day_study": 3, 
    "day_start": "2021-08-24", 
    "day_end": "2021-12-24", 
    "max_slot": 100,
    "fee": 1000000
},
});
```

error come all in status 400
status 200 is success

#### If user type 2 aka student

this api will sign this user to the course
URL : "http://intro2se-api.herokuapp.com/course/:user_id/sign?courseId=:course_id "  

### Unsign

URL : "http://intro2se-api.herokuapp.com/course/:user_id/unsign/:course_id "  
METHOD : DELETE
TOKEN require
