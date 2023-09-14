const express = require("express")
const multer = require("multer")
const moment = require("moment")
const upload = multer()
const cors = require("cors")

// lowdb 引入
const { v4: uuidv4 } = require("uuid")
const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const adapter = new FileSync("db.json")
const db = low(adapter)

// 設定密鑰
const jwt = require("jsonwebtoken")
const secretKey = "benbenbenIamben"

// 設定部份
let whitelist = [
  "http://127.0.0.1:3005",
  "http://localhost:3005",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  undefined,
]
let corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}

// 設定路由
const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

// 登入
app.post("/api/users/login", upload.none(), async (req, res) => {
  // console.log(req.body);
  // res.status(200).json({
  //   message: "User login successfully",
  //   token: "abc123",
  // });
  let user, error
  await usersLogin(req)
    .then(result => {
      user = result
    })
    .catch(err => {
      error = err
    })
  if (error) {
    res.status(400).json({ error })
    return false
  }
  if (user) {
    const token = jwt.sign(
      {
        account: user.account,
        name: user.name,
        mail: user.mail,
        head: user.head,
      },
      secretKey,
      { expiresIn: "30m" }
    )
    res.status(200).json({
      message: "User login successfully",
      token,
    })
  }
})

// 登出
app.post("/api/users/logout", checkToken, async (req, res) => {
  // await userGet(req);
  const token = jwt.sign(
    {
      account: req.decoded.account,
      name: req.decoded.name,
      mail: req.decoded.mail,
      head: req.decoded.head,
    },
    secretKey,
    { expiresIn: "-10s" }
  )
  res.status(200).json({
    message: "User logout successfully",
    token: token,
  })
})

// 登入驗證
app.post("/api/users/status", checkToken, (req, res) => {
  const token = jwt.sign(
    {
      account: req.decoded.account,
      name: req.decoded.name,
      mail: req.decoded.mail,
      head: req.decoded.head,
    },
    secretKey,
    { expiresIn: "30m" }
  )
  res.status(200).json({
    message: "驗證有效",
    token: token,
  })
})

// 新增
app.post("/api/users", upload.none(), async (req, res) => {
  // res.status(200).json({
  //   id: 3,
  //   message: "User created successfully",
  // });
  let user, error
  await userAdd(req)
    .then(result => {
      user = result
    })
    .catch(err => {
      error = err
    })
  if (error) {
    res.status(400).json({ error })
    return false
  }
  res.status(200).json({
    id: user.id,
    message: "User created successfully",
  })
})

// 修改
app.put("/api/users/:id", upload.none(), (req, res) => {
  console.log(req.body)
  let id = req.params.id
  res.status(200).json({
    id: id,
    message: "User updated successfully",
  })
})

// 刪除
app.delete("/api/users/:id", (req, res) => {
  let id = req.params.id
  res.status(200).json({
    message: "User deleted successfully",
  })
})

// 搜尋
app.get("/api/users/search", (req, res) => {
  let account = req.query.account
  res.status(200).json({
    account: account,
    name: "Maxine Jones",
    mail: "maxine.jones@example.com",
  })
})

// 取得使用者
app.get("/api/users/:id", (req, res) => {
  let id = req.params.id
  res.status(200).json({
    id: id,
    name: "Maxine Jones",
    mail: "maxine.jones@example.com",
  })
})

app.get("/api/users", (req, res) => {
  res.status(200).json([
    {
      id: 1,
      name: "Maxine Jones",
      mail: "maxine.jones@example.com",
    },
    {
      id: 2,
      name: "Rene Frazier",
      mail: "rene.frazier@example.com",
    },
  ])
})

app.listen(3005, () => {
  console.log("Example app listening on port 3005!")
})

function userGet(req) {
  return new Promise((resolve, reject) => {})
}

// 新增使用者
function userAdd(req) {
  return new Promise((resolve, reject) => {
    const { account, password, name, mail, head } = req.body
    // 判斷帳號是否有重複
    let result = db.get("users").find({ account }).value()
    if (result) {
      reject({
        status: "error",
        message: "帳號重複",
      })
      return false
    }
    // 判斷信箱是否有重複
    result = db.get("users").find({ mail }).value()
    if (result) {
      reject({
        status: "error",
        message: "信箱重複",
      })
      return false
    }
    const id = uuidv4()
    db.get("users").push({ id, account, password, name, mail, head }).write()
    resolve({ id })
  })
}

function usersLogin(req) {
  return new Promise((resolve, reject) => {
    const { account, password } = req.body
    let results = db.get("users").find({ account, password }).value()
    if (results) {
      resolve(results)
    } else {
      reject({
        status: "error",
        message: "帳號或密碼錯誤",
      })
    }

    // sql
    // connection.execute(
    //   "SELECT * FROM `user` WHERE `userID` = ? AND `userPWD` = ?",
    //   [account, password],
    //   (err, results)=>{
    //     if(err){
    //       reject(err);
    //       return false;
    //     }
    //     resolve(results);
    //   }
    // );
  })
}

function checkToken(req, res, next) {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "error", message: "驗證失敗，請重新登入" })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res
      .status(400)
      .json({ status: "error", message: "無驗證資料，請重新登入" })
  }
}
