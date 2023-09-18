const ws = new WebSocket("ws://localhost:8080")
const userId = new Date().getTime().toString()
let clientList

ws.addEventListener("open", () => {
  console.log("已連到 websocket 伺服器")

  let params = {
    // 註冊的訊息
    type: "register",
    userId,
  }
  ws.send(JSON.stringify(params))
})

ws.addEventListener("message", async e => {
  const result = JSON.parse(e.data)
  if (result.type === "registered") {
    clientList = result.otherClients
    setClients()
    return false
  }
  if (result.type === "message") {
    return false
  }
  if (result.type === "disconnected") {
    clientList = result.otherClients
    setClients()
    return false
  }
})

function setClients() {
  console.log(clientList)
  let DOMS = ""
  clientList.forEach(client => {
    let myself = client === userId ? "myself" : ""
    DOMS += `<div class="${myself}">${client}</div>`
    document.querySelector(".container").innerHTML = DOMS
  })
}
