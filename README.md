# Routes

## User routes

Main url : 'http://intro2se-api.herokuapp.com/user'

### Register

Url : 'http://intro2se-api.herokuapp.com/user/register'  
Method : POST

```javascript
fetch("http://intro2se-api.herokuapp.com/user/register", {
  header: {
    "Content-Type": "application/json",
  },
  method: POST,
  body: {
    name: "Nguyễn Trọng Phước",
    email: "phuoc2@pmail.com",
    password: "phuoc1903",
    type: 1,
    gender: "male",
    birth: "19/03/2001",
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

Url : 'http://intro2se-api.herokuapp.com/user/login'

```javascript
fetch("http://intro2se-api.herokuapp.com/user/login", {
  header: {
    "Content-Type": "application/json",
  },
  method: POST,
  body: { email: "phuoc2@pmail.com", password: "phuoc1903" },
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
        "name": "Nguyễn Trọng Phước",
        "email": "phuoc2@pmail.com",
        "password": "$2a$10$2zjjzTfrftmx5i0dsu1soOM7Sxvzzl4sBc85ayS/eFqoQXEc3bVuy",
        "type": 2,
        "gender": "male",
        "birth": "19/03/2001"
    }
}
```

add token in request.header with "auth" key for other user and course api

### User course

URL : 'http://intro2se-api.herokuapp.com/user/<user_id>/courses'  
TOKEN require
add token in header
Example

```javascript
fetch("http://intro2se-api.herokuapp.com/user/3/courses", {
  header: {
    auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzIiwidHlwZSI6MiwiaWF0IjoxNjM0NjUxMTY3fQ.e4ujo04URPb0LMcCJNfURebeUFzz3kI3heQoLdHCDfM",
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

```javascript
[
  {
    name: "intro 2 SE",
    subject_id: 1,
    time_start: "07:30:00",
    time_end: "11:00:00",
    day_study: 6,
  },
];
```

### Delete user

URL : "http://intro2se-api.herokuapp.com/user/delete"
METHOD : DELETE
TOKEN require

## Course route

### All courses

URL : "http://intro2se-api.herokuapp.com/course/all"  
TOKEN require

### Available courses

URL : "http://intro2se-api.herokuapp.com/course/available"  
TOKEN require

### Sign in a course

URL : "http://intro2se-api.herokuapp.com/course/<user_id>/sign"  
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
    name: "Intro2 SE",
    subject_id: 1,
    time_start: "07:30",
    time_end: "11:00",
    day_study: 6,
    max_slot: 30,
    fee: 1000000,
  },
});
```

error come all in status 400
status 200 is success

#### If user type 2 aka student

this api will sign this user to the course
URL : "http://intro2se-api.herokuapp.com/course/<user_id>/sign?courseId=<course_id>"

### Unsign

URL : "http://intro2se-api.herokuapp.com/course/<user_id>/unsign/<course_id>"  
METHOD : DELETE
TOKEN require
