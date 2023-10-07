const express = require("./config/express");
const { logger } = require("./config/winston");
// const { Server } = require("http2");
const { chatSocket } = require("./src/app/Chat/chatSocket");
// const { sequelize } = require('./models');
const {sendFcmMessage} = require("./config/fcm.js")

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

//FCM
sendFcmMessage("fAHWjSWbTquvbtpvIk4zx8:APA91bGsR4gijFS3xD2K0oLxyJLML6QI8Of0jK7lJCLAf3aw2VRdqRrgxkuyjkv3pVvklNrakkxAq-rkPNr3f4npn-ycRFftzbPGSoJiUJag98PWNtIiSZHZA2yDrW5NcXwHQh8sellC");

chatSocket(webserver);