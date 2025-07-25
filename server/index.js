// GET ดึงข้อมูล
// POST สร้าง/เพิ่ม ข้อมูลใหม่
// PUT แก้ไขข้อมูลทั้งหมด || สามารถทำให้แก้ไขข้อมูลบางส่วนได้
// PATCH แก้ไขข้อมูลบางส่วน
// DELETE ลบข้อมูล

const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise"); // import library mysql2
const cors = require("cors");
const app = express();

app.use(bodyparser.json());
app.use(cors());

const port = 8000;

let conn = null;
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorials",
    port: 8889, // ปกติจะเป็น 3306 แต่เราใช้ 8889
  });
};

const validateData = (userData) => {
  let errors = [];

  if (!userData.firstname) {
    errors.push("กรุณาใส่ชื่อจริง");
  }

  if (!userData.lastname) {
    errors.push("กรุณาใส่นามสกุล");
  }

  if (!userData.age) {
    errors.push("กรุณาใส่อายุ");
  }

  if (!userData.gender) {
    errors.push("กรุณาใส่เพศ");
  }

  if (!userData.interests) {
    errors.push("กรุณาใส่ความสนใจ");
  }

  if (!userData.description) {
    errors.push("กรุณาใส่รายละเอียดของคุณ");
  }

  return errors;
};

// example เส้น API hello
app.get("/hello", (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

// path = GET /users
app.get("/users", async (req, res) => {
  const results = await conn.query("SELECT * FROM users");
  res.json(results[0]);
});

// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post("/users", async (req, res) => {
  try {
    let user = req.body;

    const errors = validateData(user);
    if (errors.length > 0) {
      throw {
        message: "กรอกข้อมูลไม่ครบ",
        errors: errors,
      };
    }

    const results = await conn.query("INSERT INTO users SET ?", user);
    res.json({
      message: "insert ok",
      data: results[0],
    });
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    const errors = error.errors || [];
    console.error("error message", error.message);
    res.status(500).json({
      message: errorMessage,
      errors: errors,
    });
  }
});

// GET /users/:id สำหรับการดึง users รายคนออกมา
app.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    // let {id} = req.query;
    const results = await conn.query("SELECT * FROM users WHERE id = ?", id);
    // หา index
    if (results[0].length == 0) {
      throw { statusCode: 404, message: "User not found" };
    }
    res.json(results[0][0]);
  } catch (error) {
    console.error("error message", error.message);
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: "Something went wrong",
      errorMessage: error.message,
    });
  }
});

// path = PUT /user/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query("UPDATE users SET ? WHERE id = ?", [
      updateUser,
      id,
    ]);
    res.json({
      message: "update ok",
      data: results[0],
    });
  } catch (error) {
    console.error("error message", error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query("DELETE from users WHERE id = ?", id);
    res.json({
      message: "delete ok",
      data: results[0],
    });
  } catch (error) {
    console.error("error message", error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(port, async (req, res) => {
  await initMySQL();
  console.log("http server run at " + port);
});
