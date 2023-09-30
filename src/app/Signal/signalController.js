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
//controller : 판단 부분.

/**
 * API No. 1
 * API Name : 시그널 생성 API
 * [POST] /signal/list
 */
exports.postSignal = async function (req, res) {

  const { sigPromiseTime, sigPromiseArea, sigPromiseMenu} = req.body;
  const userIdxFromJWT = req.verifiedToken.userIdx;
  
  console.log(req.body);
  // 주석처리 한 부분은 나중에 다시 수정할 예정
/*
  if (!sigPromiseArea)
    return res.send(response(baseResponse.SIGNAL_AREA_EMPTY));
  if (!sigPromiseTime)
    return res.send(response(baseResponse.SIGNAL_TIME_EMPTY));

  const arzoneListResult = await signalProvider.arzoneList(sigPromiseArea);
  if (arzoneListResult.length <= 0)
    return res.send(response(baseResponse.LOCATION_IS_NOT_IN_ARZONE));
*/

  const signalup = await signalService.createSignal(
    userIdxFromJWT,
    sigPromiseTime,
    sigPromiseArea,
    sigPromiseMenu
  );

  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 
 * API Name : 시그널 상태조회 API
 * [GET] /signal/status
 */
exports.getSignalStatus = async function (req, res){
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const result = await signalProvider.getSignalStatus(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result))
}


/**
 * API No. 2
 * API Name : 켜져 있는 시그널 확인 API
 * [GET] /signal/list
 */
exports.getSignalList = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const result = await signalProvider.getSignalList(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 
 * API Name : 시그널 정보 조회 API
 * [GET] /signal/info
 */
exports.getSignalInfo = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const result = await signalProvider.getSignalInfo(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 3
 * API Name : 시그널 정보 수정 API
 * [PATCH] /signal/list
 */
exports.postSignalList = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { sigPromiseTime, sigPromiseArea, sigPromiseMenu, sigStart } = req.body;

  const modifySigList = await signalService.modifySigList(
    sigPromiseTime,
    sigPromiseArea,
    sigPromiseMenu,
    sigStart,
    userIdxFromJWT
  );
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 4
 * API Name : 시그널 매칭 잡혔을 때 API
 * [PATCH] /signal/list/matching
 */
exports.postSigMatch = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { matchIdx } = req.body;

  const matching = await signalService.matching(matchIdx, userIdxFromJWT);

  /*console.log("here1")
  const createChat = await chatService.createChatRoom(userIdxFromJWT, matchIdx);
  console.log("here2")*/

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
 * API Name : 시그널 삭제 API
 * [DELETE] /signal/list
 */
exports.deleteSignal = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { signalIdx } = req.body;

  const deleteSignal = await signalService.deleteSignalList(signalIdx, userIdxFromJWT);
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 7
 * API Name : 시그널 다시 ON API
 * [PATCH] /signal/list/on
 */
exports.patchSigStatusOn = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;

  const signalOn = await signalService.signalOn(userIdxFromJWT);
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 8
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
exports.getSignalApply = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;

  const result = await signalProvider.getSignalApplyed(userIdxFromJWT);
  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 9
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
 * API No. 10
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
 * API No. 11
 * API Name : 이전 시그널 조회 API
 * [GET] /signal/listed
 */
exports.getEndSignals = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  // const userIdx = req.params.userIdx;
  // const userIdx2 = req.params.userIdx;

  const endSignals = await signalProvider.endSignals(userIdxFromJWT, userIdxFromJWT);  //userIdx1, 2가 어차피 같아서 이렇게 처리합니다.
  return res.send(response(baseResponse.SUCCESS, endSignals));
};

/**
 * API No. 12
 * API Name : 주황색 유저를 위한 signalPromise Area, Time 수정
 * [PATCH] /signal/list/orange
 */

exports.patchSignalContents = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { sigPromiseTime, sigPromiseArea} = req.body;

  const signalContents = await signalService.signalContents(userIdxFromJWT
    ,sigPromiseTime,
    sigPromiseArea);
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
