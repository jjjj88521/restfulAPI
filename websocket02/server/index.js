const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 8080 })

const clients = {}

wss.on("connection", connection => {
  console.log("新的使用者已連線")

  connection.on("message", message => {
    console.log(`收到訊息: ${message}`)

    const parsedMsg = JSON.parse(message)

    if (parsedMsg.type === "register") {
      const userId = parsedMsg.userId // 取得使用者 ID
      clients[userId] = connection // 新增連線
      connection.userId = userId
      const otherClients = Object.keys(clients) // 取得所有連線
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "registered",
              otherClients,
            })
          )
        }
      })
      return false
    }

    if (parsedMsg.type === "message") {
      return false
    }

    wss.clients.forEach(client => {
      // 當使用者處於連線狀態，發送訊息
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })

  connection.on("close", () => {
    console.log("使用者已斷線")
    if (connection.userId) {
      delete clients[connection.userId]
    }
    const otherClients = Object.keys(clients) // 取得所有連線
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "disconnected",
            otherClients,
            disconnectUserId: connection.userId,
          })
        )
      }
    })
  })
})
