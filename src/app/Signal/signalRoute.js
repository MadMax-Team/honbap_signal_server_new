module.exports = function (app) {
    const signal = require("./signalController");
    const jwtMiddleware = require("../../../config/jwtMiddleware");
    //client와 통신 부분.
  
    // 시그널 생성 1 
    app.post("/signal/list", jwtMiddleware, signal.postSignal);

    // 시그널 상태 조회 2
    app.get("/signal/status", jwtMiddleware, signal.getSignalStatus);

    // 시그널 정보 조회 3
    app.get("/signal/info", jwtMiddleware, signal.getSignalInfo);

    // 시그널 정보 수정 4
    app.patch("/signal/list", jwtMiddleware, signal.patchSignalList);

    // 시그널 OFF 5
    app.delete("/signal/list/off", jwtMiddleware, signal.SigStatusOff);

    // 시그널 신청 6
    app.post("/signal/applylist", jwtMiddleware, signal.postSignalApply);

    // 시그널 신청 목록 조회 (내가 보낸) 7
    app.get("/signal/applylist", jwtMiddleware, signal.getSignalApply);

    // 시그널 신청 목록 조회 (내가 받은) 8
    app.get("/signal/applyedlist", jwtMiddleware, signal.getSignalApplyed);

    // 시그널 신청 취소 9
    app.delete("/signal/applylist", jwtMiddleware, signal.cancelSignalApply);

    // 시그널 매칭 잡혔을 때 10
    app.patch("/signal/list/matching", jwtMiddleware, signal.postSigMatch);


    // 내 시그널 ID 조회 13
    app.get("/mysignal", jwtMiddleware, signal.getMySignal);


    // 해당 닉네임의 유저 정보 조회 14
};