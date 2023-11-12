const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");

const userDao = require("./userDao");

// 회원 정보 확인
exports.userIdCheck = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdCheckResult = await userDao.existUserEmail(connection, email);
    connection.release();

    return userIdCheckResult;
  } catch (err) {
    logger.error(`userIdCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};


// email 체크
exports.emailCheck = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const emailCheckResult = await userDao.existUserEmail(connection, email);
    connection.release();

    return emailCheckResult;
  } catch (err) {
    logger.error(`emailCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 전화 번호 확인
exports.phoneNumCheck = async function (phoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const phoneNumCheckResult = await userDao.existUserPhone(
      connection,
      phoneNum
    );
    connection.release();

    return phoneNumCheckResult;
  } catch (err) {
    logger.error(`phoneNumCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 비밀 번호 확인
exports.passwordCheck = async function (email, password) {
  const loginParams = [email, password];
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.checkpassword(
      connection,
      loginParams
    );
    connection.release();

    return passwordCheckResult;
  } catch (err) {
    logger.error(`passwordCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

//======================================
//mypage

// 닉네임 체크
exports.nickNameCheck = async function (nickName) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const nickNameCheckResult = await userDao.existUserNickname(
      connection,
      nickName
    );
    connection.release();

    return nickNameCheckResult;
  } catch (err) {
    logger.error(`nicknameCheck Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 IDX 조회
exports.getUserIdx = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const userIdxCheckResult = await userDao.selectUserIdx(connection, email);
    connection.release();

    //console.log(userIdxCheckResult[0])

    return userIdxCheckResult[0];
  } catch (err) {
    logger.error(`getUserIdx Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 개인정보 조회
exports.getUserInfo = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const userInfoResult = await userDao.selectUserInfo(connection, userIdx);
    connection.release();
    return userInfoResult;
  } catch (err) {
    logger.error(`getUserInfo Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 마이페이지(프로필) 조회
exports.getUserProfile = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const userProfileResult = await userDao.selectUserProfile(
      connection,
      userIdx
    );
    connection.release();

    return userProfileResult;
  } catch (err) {
    logger.error(`getUserProfile Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카카오 계정 조회
exports.getKakaoId = async function (provider, id) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const kakaoAccountResult = await userDao.selectKakaoId(connection, [provider, id]);
    connection.release();

    return kakaoAccountResult[0];
  } catch (err) {
    logger.error(`getKakaoId Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.getFCM = async function (id) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectFCM(connection, [id]);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`FCM Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};