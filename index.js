// code away!
require("dotenv").config()

const server = require("./server");

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
    console.log(`<h2> API is online on port ${PORT}`)
})


