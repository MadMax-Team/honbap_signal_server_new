const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");

const signalProvider = require("../../app/Signal/signalProvider");
const signalService = require("../../app/Signal/signalService");
const chatService = require("../../app/Chat/chatService");
const userProvider = require("../User/userProvider");

const { response, errResponse } = require("../../../config/response");
const logger = require("../../../config/winston");
const crypto = require("crypto");
const regexEmail = require("regex-email");
const {sendFcmMessage} = require("../../../config/fcm.js")
//controller : 판단 부분.

/**
 * API No. 1
 * API Name : 시그널 생성 API
 * [POST] /signal/list
 */
exports.postSignal = async function (req, res) {
  const { sigPromiseTime, sigPromiseArea, sigPromiseMenu } = req.body;
  const userIdx = req.verifiedToken.userIdx;
  
  const result = await signalService.createSignal(
    sigPromiseTime, 
    sigPromiseArea, 
    sigPromiseMenu, 
    userIdx
  );

  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 2
 * API Name : 시그널 상태조회 API
 * [GET] /signal/status
 */
exports.getSignalStatus = async function (req, res){
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const result = await signalProvider.getSignalStatus(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result))
};

/**
 * API No. 3
 * API Name : 시그널 정보 조회 API
 * [GET] /signal/info
 */
exports.getSignalInfo = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const result = await signalProvider.getSignalInfo(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 4
 * API Name : 시그널 정보 수정 API
 * [PATCH] /signal/list
 */
exports.patchSignalList = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { sigPromiseTime, sigPromiseArea, sigPromiseMenu } = req.body;

  const modifySigList = await signalService.modifySigList(
    sigPromiseTime,
    sigPromiseArea,
    sigPromiseMenu,
    userIdxFromJWT
  );
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 5
 * API Name : 시그널 OFF API
 * [DELETE] /signal/list/off
 */
exports.SigStatusOff = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;

  const signalOff = await signalService.signalOff(userIdxFromJWT);
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 6
 * API Name : 시그널 신청 API
 * [POST] /signal/applylist
 */
exports.postSignalApply = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { userIdx, applyedIdx } = req.body;
  console.log(req.body)
  const apply = await signalService.signalApply(userIdx, applyedIdx, userIdxFromJWT);

  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 7
 * API Name : 시그널 신청 목록 조회 API (내가 보낸)
 * [GET] /signal/applylist
 */
exports.getSignalApply = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;

  const result = await signalProvider.getSignalApply(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 8
 * API Name : 시그널 신청 목록 조회 API (내가 받은)
 * [GET] /signal/applyedlist
 */
exports.getSignalApplyed = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;

  const result = await signalProvider.getSignalApplyed(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 9
 * API Name : 시그널 신청 취소 API
 * [DELETE] /signal/applylist
 */
exports.cancelSignalApply = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { applyedIdx } = req.body;

  const cancelSignal = await signalService.cancelSignalApply(
    applyedIdx,
    userIdxFromJWT
  );
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 13
 * API Name : 로그인한 유저의 signalIdx 조회
 * [GET] /mysignal
 */

exports.getMySignal = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const mySignal = await signalProvider.mySignal(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, mySignal));
};


/**
 * API No. 14
 * API Name : 해당 닉네임의 유저 정보 조회
 * [GET] /signal/info
 */
 exports.getInfoFromNickName = async function (req, res) {
   const nickName = req.body.nickName;

  //validation: 해당 유저의 닉네임이 존재하지 않는 경우
  const resultNickName = await userProvider.nickNameCheck(nickName);
  console.log(resultNickName.length);
  if (!resultNickName.length) {
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST));
  }

  const resultInfo = await signalProvider.getInfoFromNickName(nickName);

  return res.send(response(baseResponse.SUCCESS, resultInfo));
};

/**
 * API No. 10
 * API Name : 시그널 매칭 잡혔을 때 API
 * [PATCH] /signal/list/matching
 */
exports.postSigMatch = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { applyIdx } = req.body;

  //user: 시그널 수락자 
  //apply: 시그널 전송자
  const matching = await signalService.matching(applyIdx, userIdxFromJWT);

  /*console.log("here1")
  const createChat = await chatService.createChatRoom(userIdxFromJWT, matchIdx);
  console.log("here2")*/

  // 매칭된 두 명에게 fcmMessage 전송 필요
  // 추후 token 값 변경 필요
  sendFcmMessage("fAHWjSWbTquvbtpvIk4zx8:APA91bGsR4gijFS3xD2K0oLxyJLML6QI8Of0jK7lJCLAf3aw2VRdqRrgxkuyjkv3pVvklNrakkxAq-rkPNr3f4npn-ycRFftzbPGSoJiUJag98PWNtIiSZHZA2yDrW5NcXwHQh8sellC");

  return res.send(baseResponse.SUCCESS);
};


