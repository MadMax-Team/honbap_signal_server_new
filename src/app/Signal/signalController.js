const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");

const signalProvider = require("../../app/Signal/signalProvider");
const signalService = require("../../app/Signal/signalService");
const chatService = require("../../app/Chat/chatService");
const userProvider = require("../User/userProvider");
const findService = require("../../app/SignalFind/findService.js");

const { response, errResponse } = require("../../../config/response");
const logger = require("../../../config/winston");
const crypto = require("crypto");
const regexEmail = require("regex-email");
const {sendFcmMessage, buildSignalMessage,buildAlarmMessage} = require("../../../config/fcm.js")
const {buildIdxMessage} = require("../../../config/fcm.js");
//controller : 판단 부분.

/**
 * API No. 1
 * API Name : 시그널 생성 API
 * [POST] /signal/list
 */
exports.postSignal = async function (req, res) {
  const { sigPromiseTime, sigPromiseArea, sigPromiseMenu, fcm, latitude, longitude} = req.body;
  const userIdx = req.verifiedToken.userIdx;

    // 빈 값 체크
    if(!latitude)
      return res.send(baseResponse.SIGNALFIND_LATITUDE_EMPTY);

    if(!longitude)
      return res.send(baseResponse.SIGNALFIND_LONGITUDE_EMPTY);

    if(!userIdx)
    return res.send(baseResponse.SIGNALFIND_USERIDX_EMPTY);


  const result = await signalService.createSignal(
    sigPromiseTime,
    sigPromiseArea,
    sigPromiseMenu,
    fcm,
    userIdx
  );

  const params = [latitude, longitude, userIdx]
  const result2 = await findService.updateLocation(params);


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

  const fcm_user = await userProvider.getFCM(userIdxFromJWT);
  console.log("fcm",fcm_user[0].fcm);

  // const user_name = await userProvider.getUserProfile(userIdxFromJWT);
  // const apply_name = await userProvider.getUserProfile(applyedIdx);
  //
  // console.log("test");
  // console.log(user_name[0].nickName,apply_name[0].nickName);

  const fcm_apply_user = await userProvider.getFCM(applyedIdx);

  if(fcm_user) sendFcmMessage(fcm_user[0].fcm,buildIdxMessage(fcm_user[0].fcm,"10000",userIdxFromJWT.toString()));
  if(fcm_apply_user) sendFcmMessage(fcm_apply_user[0].fcm,buildAlarmMessage(fcm_apply_user[0].fcm,"10000"));

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

  const fcm_user = await userProvider.getFCM(userIdxFromJWT);
  const fcm_apply_user = await userProvider.getFCM(applyedIdx);

  if(fcm_user) sendFcmMessage(fcm_user[0].fcm,buildIdxMessage(fcm_user[0].fcm,"10000",userIdxFromJWT.toString()));
  if(fcm_apply_user) sendFcmMessage(fcm_apply_user[0].fcm,buildIdxMessage(fcm_apply_user[0].fcm,"10000",applyedIdx.toString()));

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

  //user = userIdx: 시그널 수락자
  //apply = applyIdx : 시그널 전송자
  const matchingInfo = await signalService.matching(applyIdx, userIdxFromJWT);

  console.log(matchingInfo);

  /*console.log("here1")
  const createChat = await chatService.createChatRoom(userIdxFromJWT, matchIdx);
  console.log("here2")*/

  const fcm = await userProvider.getFCM(userIdxFromJWT);
  const signalInfo = await signalProvider.getMatchInfo(userIdxFromJWT);

  const user_name = await userProvider.getUserProfile(userIdxFromJWT);
  const apply_name = await userProvider.getUserProfile(applyIdx);

  console.log(user_name[0].nickName,apply_name[0].nickName);
  
  const fcm2 = await userProvider.getFCM(applyIdx);

  //fcm 전송
  if(fcm2) sendFcmMessage(fcm2[0].fcm, buildSignalMessage(fcm2[0].fcm, "10001", applyIdx.toString(), apply_name[0].nickName, signalInfo[0].sigPromiseArea, signalInfo[0].sigPromiseTime, signalInfo[0].sigPromiseMenu));
  if(fcm) sendFcmMessage(fcm[0].fcm, buildSignalMessage(fcm[0].fcm, "10001", userIdxFromJWT.toString(), user_name[0].nickName, signalInfo[0].sigPromiseArea, signalInfo[0].sigPromiseTime, signalInfo[0].sigPromiseMenu));
  
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 11
 * API Name : 매칭 상대 정보 조회 API
 * [GET] /signal/matchInfo
 */
exports.getMatchInfo = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const mySignal = await signalProvider.matchSignal(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, mySignal));
};

/**
 * API No. 12
 * API Name : 시그널 상태수정 API
 * [PATCH] /signal/status
 */
exports.patchSignalStatus = async function (req, res){
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const result = await signalProvider.patchSignalStatus(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result))
};

/**
 * API No. 14
 * API Name : 시그널 매칭 완료 후 종료
 * [PATCH] /signal/save
 */
exports.patchSignalSave = async function (req, res){
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { applyIdx } = req.body;
  const result = await signalProvider.patchSignalSave(userIdxFromJWT);

  const user_name = await userProvider.getUserProfile(userIdxFromJWT);
  const apply_name = await userProvider.getUserProfile(applyIdx);

  const fcm = await userProvider.getFCM(userIdxFromJWT);
  const fcm2 = await userProvider.getFCM(applyIdx);

  if(fcm) sendFcmMessage(fcm[0].fcm,buildIdxMessage(10002),applyIdx.toString(),apply_name[0].nickName);
  if(fcm2) sendFcmMessage(fcm2[0].fcm,buildIdxMessage(10002),userIdxFromJWT.toString(),user_name[0].nickName);


  return res.send(response(baseResponse.SUCCESS, result))
};
