const express = require("./config/express");
const { logger } = require("./config/winston");
// const { Server } = require("http2");
const { chatSocket } = require("./src/app/Chat/chatSocket");
// const { sequelize } = require('./models');

// sequelize.sync({ force: false })
// .then(() => {
//     console.log('데이터베이스 연결 성공');
// })
// .catch((err) => {
//     console.error(err);
// });
let port;

if (process.env.NODE_ENV === "development") {
  port = 8080;
} else if (process.env.NODE_ENV === "production") {
  port = 3000;
} else {
  port = 3001;
}
const webserver = express().listen(port);
console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

chatSocket(webserver);