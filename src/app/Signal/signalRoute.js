module.exports = function (app) {
    const signal = require("./signalController");
    const jwtMiddleware = require("../../../config/jwtMiddleware");
    //client와 통신 부분.
  
    // 시그널 생성 1 
    app.post("/signal/list", jwtMiddleware, signal.postSignal);

    // 시그널 상태 조회
    app.get("/signal/status", jwtMiddleware, signal.getSignalStatus);

    // 켜져 있는 시그널 확인 2
    app.get("/signal/list", jwtMiddleware, signal.getSignalList);

    // 시그널 정보 조회
    app.get("/signal/info", jwtMiddleware, signal.getSignalInfo);

    // 시그널 정보 수정 3
    app.patch("/signal/list", jwtMiddleware, signal.postSignalList);

    // 시그널 매칭 잡혔을 때 4
    app.patch("/signal/list/matching", jwtMiddleware, signal.postSigMatch);

    // 매칭된 거 제외 삭제 = 시그널 OFF 5
    app.delete("/signal/list/off", jwtMiddleware, signal.SigStatusOff);

    // 모든 시그널 삭제 가능 6
    app.delete("/signal/list", jwtMiddleware, signal.deleteSignal);

    // 시그널 다시 ON 7 --
    app.patch("/signal/list/on", jwtMiddleware, signal.patchSigStatusOn);

    // 시그널 신청 목록 조회 (내가 보낸)
    app.get("/signal/applylist", jwtMiddleware, signal.getSignalApply);

    // 시그널 신청 목록 조회 (내가 받은)
    app.get("/signal/applyedlist", jwtMiddleware, signal.getSignalApplyed);

    // 시그널 신청 9
    app.post("/signal/applylist", jwtMiddleware, signal.postSignalApply);

    // 시그널 신청 취소 10 (by 시그널 신청자)
    app.delete("/signal/applylist", jwtMiddleware, signal.cancelSignalApply);

    // 이전 시그널 조회 11
    app.get("/signal/listed", jwtMiddleware, signal.getEndSignals);

    // 주황색 유저를 위한 Signal Promise 및 time 수정
    app.patch("/signal/list/orange", jwtMiddleware, signal.patchSignalContents);

    // 내 시그널 ID 조회 13
    app.get("/mysignal", jwtMiddleware, signal.getMySignal);

    // 해당 닉네임의 유저 정보 조회 14
};