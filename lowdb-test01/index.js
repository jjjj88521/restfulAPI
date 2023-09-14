const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = lowdb(adapter);
const { v4: uuidv4 } = require("uuid");

// 初始化
// db.defaults({ products: [], users: {} }).write();

// 使用 push 方法新增資料
// db.get("products")
//   .push({
//     id: uuidv4(),
//     title: "櫛瓜",
//     price: 45,
//     stock: 100,
//     createTime: Date.now(),
//   })
//   .write();

// db.get("products")
//   .unshift({
//     id: uuidv4(),
//     title: "小黃瓜",
//     price: 30,
//     stock: 1000,
//     createTime: Date.now(),
//   })
//   .write();

// 使用 set 方法新增資料
// db.set("users.id", uuidv4())
//   .set("users.account", "user1")
//   .set("users.password", "123456")
//   .set("users.name", "Emma Richards")
//   .set("users.head", "https://randomuser.me/api/portraits/women/17.jpg")
//   .write();

// let id = uuidv4();
// let user = {
//   id: id,
//   account: "user1",
//   password: "123456",
//   name: "Emma Richards",
//   head: "https://randomuser.me/api/portraits/women/17.jpg",
// };
// db.set(`users.${id}`, user).write();

// 讀取資料
// let products = db.get("products").value();
// let users = db.get("users").value();
// console.log(products);
// console.log(users);

// 找出 id 為 06f15555-5710-41f1-8a50-bf5622cf377d 的資料
// let data = db
//   .get("products")
//   .find({ id: "06f15555-5710-41f1-8a50-bf5622cf377d" })
//   .value();

// 找出所有包含 "瓜" 的資料
// let data = db
//   .get("products")
//   .filter(p => p.title.includes("瓜"))
//   .value();

// 分頁
// let data = db.get("products").slice(0).take(5).value();

// 修改 id 為 06f15555-5710-41f1-8a50-bf5622cf377d 的資料
// let data = db
//   .get("products")
//   .find({ id: "06f15555-5710-41f1-8a50-bf5622cf377d" })
//   .assign({ stock: 90 })
//   .write();

// 刪除 id 為 06f15555-5710-41f1-8a50-bf5622cf377d 的資料
// let data = db
//   .get("products")
//   .remove({ id: "06f15555-5710-41f1-8a50-bf5622cf377d" })
//   .write();

console.log(data);
