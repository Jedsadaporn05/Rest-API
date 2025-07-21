// GET ดึงข้อมูล
// POST สร้าง/เพิ่ม ข้อมูลใหม่
// PUT แก้ไขข้อมูลทั้งหมด || สามารถทำให้แก้ไขข้อมูลบางส่วนได้
// PATCH แก้ไขข้อมูลบางส่วน
// DELETE ลบข้อมูล

const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.use(bodyparser.json());

const port = 8000;

// สำหรับเก็บ users
let users = []
let counter = 1;

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

// path = GET /users
app.get('/users', (req, res) => {
    const filterUsers = users.map(user => {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.firstname + ' ' + user.lastname,
        }
    })
    res.json(filterUsers)
})

// path = POST /user
app.post('/users', (req, res) => {
    let user = req.body 
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: 'add ok',
        user: user
    })
})

// GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', (req, res) => {
    let id = req.params.id;

    // หาก่อนว่า index ของ user ที่ต้องการจะลบคือ index ไหน
    let selectedIndex = users.findIndex(user => user.id == id)

    // หา index
    res.json(users[selectedIndex])
})

// path = PUT /user/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;

    // หา users จาก id ที่ส่งมา
    let selectedIndex = users.findIndex(user => user.id == id)
    // update users นั้น
        users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
        users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
        users[selectedIndex].age = updateUser.age || users[selectedIndex].age
        users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender

    // put
    // users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    // users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname

    res.json({
        message: 'update user complete!',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})

// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', (req, res) => {
    let id = req.params.id;

    // หาก่อนว่า index ของ user ที่ต้องการจะลบคือ index ไหน
    let selectedIndex = users.findIndex(user => user.id == id)

    // ลบ user ที่ต้องการออก
    // delete users[selectedIndex] // ใช้อันนี้จะลบออกเป็น null
    users.splice(selectedIndex, 1)

    res.json({
        message: 'delete complete!',
        indexDeleted: selectedIndex
    })
})

app.listen(port, (req, res) => {
    console.log('http server run at ' + port);
})