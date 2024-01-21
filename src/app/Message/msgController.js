const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");

const msgProvider = require("../../app/Message/msgProvider");
const userProvider = require("../../app/User/userProvider");
const msgService = require("../../app/Message/msgService");
const signalService = require("../../app/Signal/signalService");

const {sendFcmMessage, buildSignalMessage,buildAlarmMessage} = require("../../../config/fcm.js")
const {buildIdxMessage} = require("../../../config/fcm.js");
const { response, errResponse } = require("../../../config/response");
const {fcm} = require("googleapis/build/src/apis/fcm");
const {buildMessageAlarm} = require("../../../config/fcm");

// 쪽지 방 생성
exports.createMsgRoom = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const matchIdx = req.body.matchIdx;

  const roomId = userIdxFromJWT + '_' + matchIdx;
  const roomId2 = matchIdx + '_' + userIdxFromJWT;


  if(!matchIdx) {
    return res.send(response(baseResponse.MSG_MATCHIDX_EMPTY));
  } // matchIdx 값이 들어오지 않았습니다.



  const result = await msgService.createMsgRoom(userIdxFromJWT, matchIdx, roomId , roomId2);
  return res.send(baseResponse.SUCCESS);
}

// 쪽지 방 조회
exports.getMsgRoom = async function (req, res) {
  const userIdx = req.verifiedToken.userIdx;

  const result = await msgProvider.getMsgRoom(userIdx);

  return res.send(response(baseResponse.SUCCESS, result));
}

// 쪽지 보내기
exports.sendMsg = async function (req, res) {
  const senderIdx = req.verifiedToken.userIdx;
  const roomId = req.params.roomId;
  const {msg}= req.body;

  //console.log(msg);

  if(!senderIdx) {
    return res.send(response(baseResponse.MSG_SENDERIDX_EMPTY));
  }
  if(!msg) {
    return res.send(response(baseResponse.MSG_TEXT_EMPTY));
  }
  if(msg.length > 500) {
    return res.send(response(baseResponse.MSG_TEXT_OVER));
  }
  var applyedIdx = 0;
  const arr = roomId.split("_");
  if(senderIdx == arr[0]) applyedIdx = arr[1];
  else applyedIdx = arr[0];
  const fcm_apply_user = await userProvider.getFCM(applyedIdx);
  if(fcm_apply_user) sendFcmMessage(fcm_apply_user[0].fcm,buildMessageAlarm(fcm_apply_user[0].fcm,
      "11000","새로운 쪽지 알림","상대방에게 온 새로운 쪽지를 확인해 보세요!"));

  const result = await msgService.sendMsg(roomId, senderIdx, msg);
  return res.send(baseResponse.SUCCESS);
}

// 쪽지 내용 확인
exports.getMsg = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const roomId = req.params.roomId;

  if(!roomId) {
    return res.send(response(baseResponse.MSG_ROOMID_EMPTY));
  }
  console.log(roomId)

  const arr = roomId.split("_");
  const userIdx = arr[0];
  const matchIdx = arr[1];

  // 보낸/받는 사람 구별
  if (userIdxFromJWT == userIdx) {
    const result = await msgProvider.getMsg(roomId, userIdx, matchIdx);
    return res.send(response(baseResponse.SUCCESS, result));
  }
  else if (userIdxFromJWT == matchIdx) {
    const result = await msgProvider.getMsg(roomId, matchIdx, userIdx);
    return res.send(response(baseResponse.SUCCESS, result));
  }
};

// 쪽지 방 삭제
exports.deleteMsg = async function (req, res) {
  const userIdx = req.verifiedToken.userIdx;
  const roomId = req.body.roomId;

  if(!roomId) {
    return res.send(response(baseResponse.MSG_ROOMID_EMPTY));
  }

  const arr = roomId.split("_");
  const userIdxAtRoom = arr[0];
  const matchIdxAtRoom = arr[1];

  const getRoomIdxResult = await msgProvider.getRoomIdx(roomId);
  const MsgRoomUserIdx = getRoomIdxResult[0].userIdx;
  const MsgRoomMatchIdx = getRoomIdxResult[0].matchIdx;

  if(MsgRoomUserIdx == 7 || MsgRoomMatchIdx == 7) {
    const result = await msgService.deleteMsg(roomId);
  } else if(userIdx == userIdxAtRoom) {
    const result = await msgService.updateExitUserIdx(roomId, MsgRoomMatchIdx, 1);
  } else if(userIdx == matchIdxAtRoom) {
    const result = await msgService.updateExitUserIdx(roomId, MsgRoomUserIdx, 2);
  }

  return res.send(baseResponse.SUCCESS);
}

// 약속장소 만들기

exports.createPromise = async function (req,res) {
  const userIdx = req.verifiedToken.userIdx;
  const roomId = req.params.roomId;
  console.log("test");
  console.log(roomId);
  const {
    applyedIdx,
    where,
    when,
    menu
  } = req.body;

  //빈 값 체크
  if(!where){
    return res.send(response(baseResponse.MSG_WHERE_EMPTY));
  }
  if(!when){
    return res.send(response(baseResponse.MSG_WHEN_EMPTY));
  }
  if(!menu){
    return res.send(response(baseResponse.MSG_MENU_EMPTY));
  }
  console.log(where,when,menu,userIdx,roomId)

  const promiseResponse = await msgService.createPromise(where,when,menu,userIdx,roomId);
  const signalResponse = await signalService.modifySigList(when,where,menu,userIdx);


  const arr = roomId.split("_");
  const userIdxAtRoom = arr[0];
  const matchIdxAtRoom = arr[1];

  const user_name = await userProvider.getUserProfile(userIdx);
  const apply_name = await userProvider.getUserProfile(applyedIdx);

  const fcm_user = await userProvider.getFCM(userIdx);
  const fcm_apply_user = await userProvider.getFCM(applyedIdx);


  const info_test = {userIdx : userIdx.toString(),nickname : user_name[0].nickname,sigPromiseArea : where
  ,sigPromiseTime : when,sigPromiseMenu : menu};
  const info_test2 = {userIdx : applyedIdx.toString(),nickname : apply_name[0].nickname,sigPromiseArea : where
    ,sigPromiseTime : when,sigPromiseMenu : menu};

  var info_json = JSON.stringify(info_test);
  var info_json2 = JSON.stringify(info_test2);

  if(fcm_user) sendFcmMessage(fcm_user[0].fcm,buildSignalMessage(fcm_user[0].fcm,"식사일정 변동알림",
      "고객님의 시그널 정보가 성공적으로 변경되었어요!","11001", [info_json]));

  if(fcm_apply_user) sendFcmMessage(fcm_apply_user[0].fcm,buildSignalMessage(fcm_apply_user[0].fcm,"식사일정 변동알림",
      "고객님의 시그널 정보가 성공적으로 변경되었어요!","11001",
      [info_json2]));
  return res.send(baseResponse.SUCCESS);

}
