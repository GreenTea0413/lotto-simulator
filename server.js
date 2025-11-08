const fs = require("fs")
const https = require("https")
const { createServer } = require("http")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const port = 3000

app.prepare().then(() => {
  const httpsOptions = {
    key: fs.readFileSync("./localhost-key.pem"),
    cert: fs.readFileSync("./localhost.pem"),
  }

  https.createServer(httpsOptions, (req, res) => {
    handle(req, res)
  }).listen(port, () => {
    console.log(`> HTTPS Ready on https://localhost:${port}`)
  })
})