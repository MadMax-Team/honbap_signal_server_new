const jwtMiddleware = require("../../../config/jwtMiddleware");
const findProvider = require("../../app/SignalFind/findProvider");
const findService = require("../../app/SignalFind/findService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");


/**
 * API No. 1
 * API Name : 내 위치 전송 API (초기에 한번 실행)
 * [POST] /app/signalFind/:myLocation
 */
exports.postMyLocation = async function (req, res) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    const userIdx = req.verifiedToken.userIdx;

    // 빈 값 체크
    if(!latitude)
      return res.send(response(baseResponse.SIGNALFIND_LATITUDE_EMPTY));

    if(!longitude)
      return res.send(response(baseResponse.SIGNALFIND_LONGITUDE_EMPTY));
    
    if(!userIdx)
      return res.send(response(baseResponse.SIGNALFIND_USERIDX_EMPTY)); 

    const locationResponse = await findService.createUserLocation(userIdx, latitude, longitude);

    return res.send(response(locationResponse));
  }
/**
 * API No. 2
 * API Name : 내 위치 업데이트 API
 * [POST] /signalFind'
 */

  exports.patchMyLocation = async function (req, res) {
    var {latitude, longitude} = req.body;
    const userIdx = req.verifiedToken.userIdx;

    // 빈 값 체크
    if(!latitude)
      return res.send(response(baseResponse.SIGNALFIND_LATITUDE_EMPTY));

    if(!longitude)
      return res.send(response(baseResponse.SIGNALFIND_LONGITUDE_EMPTY));

    if(!userIdx)
    return res.send(response(baseResponse.SIGNALFIND_USERIDX_EMPTY)); 

    const params = [latitude, longitude, userIdx]
    const result = await findService.updateLocation(params);

    return res.send(response(baseResponse.SUCCESS, result[0]));
  }
/**
 * API No. 3
 * API Name : range = 3km에 해당되는 내 근처 시그널 목록 조회 API + paging 추가.
 * [GET] /signalFind/list'
 */

  exports.getSignalList = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;

    // 빈 값 체크
    if(!userIdx)
    return res.send(response(baseResponse.SIGNALFIND_USERIDX_EMPTY));

    // const params = [userIdx];
    const signalListResponse = await findProvider.getSignalList(userIdx);
    logger.info(signalListResponse);

    return res.send(response(baseResponse.SUCCESS, signalListResponse));
  }