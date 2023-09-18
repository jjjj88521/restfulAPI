const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 8080 })

const clients = {} // 所有連線的使用者
const rooms = {} // 房間

wss.on("connection", connection => {
  console.log("新的使用者已連線")

  connection.on("message", message => {
    console.log(`收到訊息: ${message}`)

    const parsedMsg = JSON.parse(message)
    // 建立連線，使用者登入房間
    if (parsedMsg.type === "register") {
      const userId = parsedMsg.userId // 取得使用者 ID
      clients[userId] = connection // 新增連線
      connection.userId = userId
      const otherClients = Object.keys(clients) // 取得所有連線

      let allRooms = [] // 取得所有房間
      for (let [key, value] of Object.entries(rooms)) {
        let id = key
        let name = value
        allRooms.push({ id, name })
      }

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "registered",
              otherClients,
              registeredId: userId,
              allRooms,
            })
          )
        }
      })
      return false
    }

    // 建立房間
    if (parsedMsg === "createRoom") {
      let roomId = parsedMsg.roomId
      rooms[roomId] = {
        id: parsedMsg.roomId,
        name: parsedMsg.roomName,
      }
      rooms[roomId].userList = []
      rooms[roomId].userList.push(parsedMsg.fromId)
      let allRooms = [] // 取得所有房間
      for (let [key, value] of Object.entries(rooms)) {
        let id = key
        let name = value
        allRooms.push({ id, name })
      }
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "newRoom",
              allRooms,
            })
          )
        }
      })
      return false
    }

    // 加入房間
    if (parsedMsg === "joinRoom") {
      let roomId = parsedMsg.roomId
      let fromId = parsedMsg.fromId
      rooms[roomId].userList.push(fromId)
      let clientList = rooms[roomId].userList
      rooms[roomId].userList.forEach(uid => {
        let target = clients[uid]
        if (target.readyState === WebSocket.OPEN) {
          target.send(
            JSON.stringify({
              type: "joinRoom",
              fromId,
              roomId,
              clientList,
            })
          )
        }
      })
      return false
    }

    // 離開房間
    if (parsedMsg === "leaveRoom") {
      let roomId = parsedMsg.roomId
      let fromId = parsedMsg.fromId
      rooms[roomId].userList = arrayRemove(rooms[roomId].userList, fromId)
      let clientList = rooms[roomId].userList
      rooms[roomId].userList.forEach(uid => {
        let target = clients[uid]
        if (target.readyState === WebSocket.OPEN) {
          target.send(
            JSON.stringify({
              type: "leaveRoom",
              fromId,
              roomId,
              clientList,
            })
          )
        }
      })
      if (rooms[roomId].userList.length === 0) {
        delete rooms[roomId]
      }
      let allRooms = [] // 取得所有房間
      for (let [key, value] of Object.entries(rooms)) {
        let id = key
        let name = value
        allRooms.push({ id, name })
      }
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "newRoom",
              allRooms,
            })
          )
        }
      })
      return false
    }

    if (parsedMsg.type === "message") {
      const targetUserId = parsedMsg.targetUserId
      const fromId = parsedMsg.fromId
      const roomId = parsedMsg.roomId
      const message = parsedMsg.message
      if (roomId) {
        // 接小房間內的訊息
        if (targetUserId) {
          const targetClient = clients[targetUserId]
          if (targetClient.readyState === WebSocket.OPEN) {
            targetClient.send(
              JSON.stringify({
                type: "message",
                message,
                fromId,
                roomId,
                targetUserId,
                private: true,
              })
            )
          } else {
            const targetClient = clients[userId]
            if (targetClient.readyState === WebSocket.OPEN) {
              targetClient.send(
                JSON.stringify({
                  type: "message",
                  message,
                  fromId,
                  roomId,
                })
              )
            }
          }
        }
        return false
      }
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "message",
              message,
              fromId,
            })
          )
        }
      })
    }
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

function arrayRemove(arr, value) {
  return arr.filter(item => {
    return item != value
  })
}
