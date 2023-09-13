// 接設定
const express = require("express");
const multer = require("multer");
const moment = require("moment");
const upload = multer();
const cors = require("cors");
// json web token
const jwt = require("jsonwebtoken");
const secretKey = "benbenben";

const users = require("./users");

// 設定
let whitelist = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  undefined,
];

let corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// 接路由規則
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由規則
app.get("/", (req, res) => {
  res.send("首頁");
});

app.post("/login", upload.none(), (req, res) => {
  const { account, password } = req.body;
  // 從 users 中找到符合的資料
  const user = users.find(
    u => u.account === account && u.password === password
  );
  if (user) {
    // 建立 token
    const token = jwt.sign(
      // 傳入 payload
      {
        account: user.account,
        name: user.name,
        mail: user.mail,
        head: user.head,
      },
      secretKey, // 密鑰
      { expiresIn: "30m" } // token 有效期為 30 分鐘
    );
    res.status(200).json({
      status: "success",
      message: "登入成功",
      token,
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "帳號或密碼錯誤",
    });
  }
});

app.post("/logout", checkToken, (req, res) => {
  const user = users.find(u => u.account === req.decoded.account);
  if (user) {
    // 建立 token
    const token = jwt.sign(
      // 傳入 payload
      {
        account: "",
        name: "",
        mail: "",
        head: "",
      },
      secretKey,
      { expiresIn: "-10s" }
    );
    res.status(200).json({
      status: "success",
      message: "登出成功",
      token,
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "登出失敗，請稍後再試",
    });
  }
});

app.post("/checkLogin", checkToken, (req, res) => {
  const user = users.find(u => u.account === req.decoded.account);
  if (user) {
    // 建立 token
    const token = jwt.sign(
      // 傳入 payload
      {
        account: user.account,
        name: user.name,
        mail: user.mail,
        head: user.head,
      },
      secretKey,
      { expiresIn: "30m" } // token 有效期為 30 分鐘
    );
    res.status(200).json({
      status: "success",
      message: "驗證成功",
      token,
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "驗證失敗，請重新登入",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

function checkToken(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(400).json({
          status: "fail",
          message: "登入驗證失敗，請重新登入。",
        });
        return false;
      }
      // 成功要做的事
      req.decoded = decoded;
      next();
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "無驗證資料，請重新登入。",
    });
  }
}
