module.exports = function (app) {
  const find = require("./findController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 1. 내 위치 업데이트 API
  app.patch('/signalFind', jwtMiddleware, find.patchMyLocation);

  // 2. range에 해당되는 내 근처 시그널 목록 조회 API
  app.get('/signalFind/list', jwtMiddleware, find.getSignalList);
}