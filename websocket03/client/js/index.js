const leftArea = document.querySelector(".left")
const rightArea = document.querySelector(".right")
const btnSend = document.querySelector(".btn-send")
const msgInput = document.querySelector("[name=msg]")

const ws = new WebSocket("ws://localhost:8080")
const userId = new Date().getTime().toString()
let clientList, targetUserId

btnSend.addEventListener("click", sendMessage)
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage()
})

ws.addEventListener("open", () => {
  console.log("已連到 websocket 伺服器")
  leftArea.innerHTML += `<div>你已經進入聊天室，你的 id 為 ${userId}</div>`

  let params = {
    // 註冊的訊息
    type: "register",
    userId,
  }
  ws.send(JSON.stringify(params))
})

ws.addEventListener("message", async e => {
  let result = JSON.parse(e.data)
  if (result.type === "registered") {
    console.log(result)
    clientList = result.otherClients
    let registeredId = result.registeredId
    setClients()
    if (registeredId && registeredId !== userId) {
      leftArea.innerHTML += `<div>使用者 ${registeredId} 已經進入聊天室了</div>`
    }
    return false
  }
  if (result.type === "message") {
    let fromId = result.fromId
    let message = result.message
    let toFix = `<span class="px-2">說</span>`
    if (fromId === userId) {
      fromId = "我自己"
    }
    if (result.private) {
      toFix = `<span class="px-2">私訊</span>`
    }
    let icon = `<span class="badge bg-primary">${fromId}</span>`
    leftArea.innerHTML += `<div class="d-flex align-items-center">${icon}${toFix}: ${message}</div>`
    leftArea.scrollTop = leftArea.scrollHeight
    return false
  }
  if (result.type === "disconnected") {
    clientList = result.otherClients
    let disconnectedId = result.disconnectUserId
    setClients()
    if (disconnectedId) {
      leftArea.innerHTML += `<div>使用者 ${disconnectedId} 離開聊天室了</div>`
    }
    return false
  }
})

function setClients() {
  console.log(clientList)
  let DOMS = ""
  clientList.forEach(client => {
    // 顯示其他使用者
    if (client !== userId) {
      DOMS += `<div idn=${client} class="btn btn-secondary mb-1">${client}</div>`
    }
  })
  rightArea.innerHTML = DOMS
  let btns = rightArea.querySelectorAll(".btn")
  btns.forEach(btn => {
    btn.addEventListener("click", async e => {
      let target = e.currentTarget
      let idn = target.getAttribute("idn")
      if (targetUserId && targetUserId !== idn) {
        return false
      }
      if (target.classList.contains("btn-danger")) {
        targetUserId = null
        target.classList.remove("btn-danger")
      } else {
        targetUserId = idn
        target.classList.add("btn-danger")
      }
    })
  })
}

function sendMessage() {
  let message = msgInput.value
  let params = {
    type: "message",
    message,
    fromId: userId,
  }
  if (targetUserId) {
    params.targetUserId = targetUserId
  }
  ws.send(JSON.stringify(params))
  msgInput.value = ""
  // 私訊的演出
  if (targetUserId) {
    let icon1 = `<span class="badge bg-primary">我自己</span>`
    let icon2 = `<span class="badge bg-primary">${targetUserId}</span>`
    let toFix = `<span class="px-2">私訊</span>`
    let template = `<div class="d-flex align-items-center">${icon1} 對 ${icon2}${toFix}: ${message}</div>`
    leftArea.innerHTML += template
    leftArea.scrollTop = leftArea.scrollHeight
  }
}
