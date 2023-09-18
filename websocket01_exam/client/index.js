const alertContainer = document.querySelector(".alert-container")
const ws = new WebSocket("ws://localhost:8080")
let alertNum = 0

ws.addEventListener("message", async e => {
  alertNum++
  const text = await e.data.text()
  let template = `<div id="alert${alertNum}" class="alert alert-danger alert-dismissible fade show" role="alert">
  ${text}
  <button
    type="button"
    class="btn-close"
    data-bs-dismiss="alert"
    aria-label="Close"
  ></button>
</div>`
  alertContainer.innerHTML += template
})
