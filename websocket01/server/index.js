const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 8080 })

wss.on("connection", connection => {
  console.log("新的使用者已連線")

  connection.on("message", message => {
    console.log(`收到訊息: ${message}`)
    wss.clients.forEach(client => {
      // 當使用者處於連線狀態，發送訊息
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })

  connection.on("close", () => {
    console.log("使用者已斷線")
  })
})
