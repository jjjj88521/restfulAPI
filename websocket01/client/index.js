const btn = document.querySelector("#button")
const chatBox = document.querySelector("#chatBox")
const chatInput = document.querySelector("#chatInput")

const ws = new WebSocket("ws://localhost:8080")

btn.addEventListener("click", () => {
  let msg = chatInput.value
  ws.send(msg)
  chatInput.value = ""
})

ws.addEventListener("open", () => {
  console.log("已連到 websocket 伺服器")
})

ws.addEventListener("message", async e => {
  const text = await e.data.text()
  chatBox.innerHTML += `<div>${text}</div>`
})
