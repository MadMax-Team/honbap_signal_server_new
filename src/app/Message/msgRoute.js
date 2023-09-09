module.exports = function (app) {
    const jwtMiddleware = require("../../../config/jwtMiddleware");
    const msgController = require("./msgController");

    // 쪽지 방 생성
    app.post("/msg", jwtMiddleware, msgController.createMsgRoom);

    // 쪽지 방 확인
    app.get("/msg", jwtMiddleware, msgController.getMsgRoom);

    // 쪽지 보내기
    app.post("/msg/:roomId", jwtMiddleware, msgController.sendMsg);

    // 쪽지 확인
    app.get("/msg/:roomId", jwtMiddleware, msgController.getMsg);

    //

    // 쪽지 방 삭제
    app.delete("/msg", jwtMiddleware, msgController.deleteMsg);

    // 쪽지 방 약속장소 생성
    app.patch("/msg/promise/:roomId",jwtMiddleware,msgController.createPromise)

};
