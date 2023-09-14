module.exports = function (app) {
    const jwtMiddleware = require("../../../config/jwtMiddleware");
    const report = require("./reportController");

    // 1. 신고 등록
    app.post('/report',jwtMiddleware ,report.postReport);
}
