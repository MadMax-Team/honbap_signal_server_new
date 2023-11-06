const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");

const signalDao = require("./signalDao");

// 시그널 상태 조회 2
exports.getSignalStatus = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const userIdxCheckResult = await signalDao.getSignalStatus(
      connection,
      userIdx
    );
    connection.release();

    //시그널이 없는 경우 sigStatus == 0, sigMatchStatus == 0으로 출력
    if (userIdxCheckResult.length === 0) {
      userIdxCheckResult.push({ sigStatus: 0, sigMatchStatus: 0 });
    }
    return userIdxCheckResult[0];
  } catch (err) {
    logger.error(`getSignalList Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// 시그널 정보 조회 3
exports.getSignalInfo = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const signalInfoCheckResult = await signalDao.getSignalInfo(
      connection,
      userIdx
    );
    connection.release();

    return signalInfoCheckResult[0];
  } catch (err) {
    logger.error(`getSignalInfo Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }  
}

// 시그널 신청 리스트 조회 (내가 보낸) 7
exports.getSignalApply = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const applyResult = await signalDao.getSignalApply(connection, userIdx);
    connection.release();

    return applyResult;
  } catch (err) {
    logger.error(`getSignalApply Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 시그널 신청 리스트 조회 (내가 받은) 8
exports.getSignalApplyed = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const applyResult = await signalDao.getSignalApplyed(connection, userIdx);
    connection.release();

    return applyResult;
  } catch (err) {
    logger.error(`getSignalApply Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 로그인한 유저들의 signalIdx
exports.mySignal = async function (userIdx) {
  try {
    const params = [userIdx];
    const connection = await pool.getConnection(async (conn) => conn);

    const mySignalResult = await signalDao.mySignal(connection, params);
    connection.release();

    return mySignalResult;
  } catch (err) {
    logger.error(`mySignal Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.arzoneList = async function (sigPromiseArea) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const arzoneResult = await signalDao.arzoneList(connection, sigPromiseArea);
    connection.release();

    return arzoneResult;
  } catch (err) {
    logger.error(`endSignals Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 닉네임으로 유저 정보 조회
exports.getInfoFromNickName = async function (nickName) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const [getInfoResult] = await signalDao.getInfoFromNickName(connection, nickName);
    connection.release();

    return getInfoResult;
  } catch (err) {
    logger.error(`getInfoFromNickName Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

// 로그인한 유저들의 signalIdx
exports.matchSignal = async function (userIdx) {
  try {
    const params = [userIdx];
    const connection = await pool.getConnection(async (conn) => conn);

    const matchSignalResult = await signalDao.matchSignal(connection, params);
    connection.release();

    return matchSignalResult;
  } catch (err) {
    logger.error(`matchSignal Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};