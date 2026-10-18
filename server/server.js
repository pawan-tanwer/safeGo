require("dotenv").config();
const app = require("./src/app.js");
const http = require("http");

const {initSocket }= require("./src/socket/socket.js")

const connectDB = require("./src/config/db.js");
connectDB();

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});