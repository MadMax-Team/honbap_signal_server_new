const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })
const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
// const secret_config = require("../../../config/secret");
// const secret_config = require()

const jwtsecret = process.env.JWTSECRET

const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

  // 회원가입
  // 오류 코드는 나중에 수정할 예정
exports.createUsers = async function (email, password, userName, birth, phoneNum, sex) {
    try {
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL); }


        // const nickNameRows = await userProvider.nickNameCheck(nickName);
        // if (nickNameRows.length > 0)
        //     return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        const phoneNumRows = await userProvider.phoneNumCheck(phoneNum);

        if (phoneNumRows.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER); }




        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        const insertUserInfoParams = [email, hashedPassword, userName, birth, phoneNum, sex];





        const connection = await pool.getConnection(async (conn) => conn);
        const emailResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        const [insertUserProfileidx] =await userDao.selectUserIdx(connection,email);
        console.log(insertUserProfileidx.userIdx);
        const insertUserProfilenull = await userDao.insertUsernull(connection,insertUserProfileidx.userIdx);

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUsers Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 유저 프로필 등록 : 데옹
exports.createUserProfile = async function (userIdx, profileImg, taste, hateFood, interest, avgSpeed, preferArea, mbti, userIntroduce) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        const insertUserProfileParams =
            [userIdx, profileImg, taste, hateFood,
                interest, avgSpeed, preferArea, mbti, userIntroduce];
        const createUserLocation = [userIdx];
        const createUserManner = [userIdx];

        const profileResult = await userDao.insertUserProfile(connection, insertUserProfileParams);
        const LocationResult = await userDao.createUserLocation(connection, createUserLocation);
        const mannerResult = await userDao.createUserManner(connection, createUserManner);
        //console.log(`추가된 회원 : ${profileResult[0].insertId}`)

        await connection.commit();

        connection.release();
        return response(baseResponse.SUCCESS);

  } catch (err) {
      await connection.rollback();
      connection.release();
      logger.error(`App - createUserProfile Service error\n: ${err.message}`);
      return errResponse(baseResponse.DB_ERROR);
  }
};

// 패스워드 변경
exports.updatePassword = async function(password, userIdx) {
    try {

        const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

        const connection = await pool.getConnection(async (conn) => conn);

        const params = [hashedPassword, userIdx];
        const result = await userDao.updatePassword(connection, params);

        connection.release();

        return result;
    } catch (err) {
        logger.error(`App - updatePassword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 유저 개인정보 변경
exports.updateUserInfo = async function(userName, birth, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const params = [userName, birth, userIdx];
        const result = await userDao.updateUserInfo(connection, params);

        connection.release();

        return result;
    } catch (err) {
        logger.error(`App - updateUserInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 유저 프로필 변경
exports.updateUserProfile = async function(nickName,profileImg, taste, hateFood, interest, avgSpeed, preferArea, mbti, userIntroduce, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const params = [nickName,profileImg, taste, hateFood, interest,avgSpeed,
                        preferArea, mbti, userIntroduce, userIdx];
        const result = await userDao.updateUserProfile(connection, params);
        return result;
    } catch (err) {
        logger.error(`App - updateUserProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 로그인
exports.login = async function (email, password){
    try {
        console.log("test")
        const [emailRows] = await userProvider.emailCheck(email);
        console.log(emailRows.email)

        if (emailRows.length == 0)
            return errResponse(baseResponse.USER_IS_NOT_EXIST);

        selectUserEmail = emailRows.email


        console.log("selectUserEmail :", selectUserEmail);
        console.log("jwtsecret : ", jwtsecret);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달

        const passwordRows = await userProvider.passwordCheck(selectUserEmail, hashedPassword);
        if (passwordRows.length == 0)
            return errResponse(baseResponse.LOGIN_PW_NOT_CORRECT);

        const userIdxRow = await userProvider.getUserIdx(email);

        console.log("userIdx in jwt: ", userIdxRow[0].userIdx)


        let jwtToken = await jwt.sign(
            {
                userIdx : userIdxRow[0].userIdx
            },
            jwtsecret,
            {
                expiresIn: "365d",
                subject: "userInfo",
            }
        );
        return response(baseResponse.SUCCESS, {'userIdx': userIdxRow[0].userIdx , 'jwt': jwtToken});

        // return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.LOGIN_SUCCESS,
        //     {
        //       /* 생성된 Token을 클라이언트에게 Response */
        //         token: jwtToken.token
        //     }));
        //console.log(`로그인 되었습니다.`)
    } catch (err) {
        logger.error(`App - login Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 카카오 로그인
exports.kakaoLogin = async function (email){
    try {
        const userIdxRow = await userProvider.getUserIdx(email);

        console.log("userIdx in jwt: ", userIdxRow[0].userIdx);


        let jwtToken = await jwt.sign(
            {
                userIdx : userIdxRow[0].userIdx
            },
            jwtsecret,
            {
                expiresIn: "365d",
                subject: "userInfo",
            }
        );
        return response(baseResponse.SUCCESS, {'userIdx': userIdxRow[0].userIdx , 'jwt': jwtToken});

        // return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.LOGIN_SUCCESS,
        //     {
        //       /* 생성된 Token을 클라이언트에게 Response */
        //         token: jwtToken.token
        //     }));
        // console.log(`로그인 되었습니다.`)
    } catch (err) {
        logger.error(`App - login Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 이미지 업로드
exports.uploadImage = async function (userIdx,location){
    try{
        //변수 값 배열 형태로 전달
        insertUserimage = [location,userIdx];
        const connection = await pool.getConnection(async (conn)=>conn);
        const imageResult = await userDao.updateUserImage(connection,insertUserimage);

        connection.release();
        return insertUserimage;
    }
    catch (err){
        logger.error(`App - image upload error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
