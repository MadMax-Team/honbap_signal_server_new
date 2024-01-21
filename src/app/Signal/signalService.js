const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");

const signalProvider = require("./signalProvider");
const signalDao = require("./signalDao");

const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const { connect } = require("http2");


// 시그널 등록 1
exports.createSignal = async function (sigPromiseTime, sigPromiseArea, sigPromiseMenu, fcm, userIdx) {

    let checkSigWrite = 1;

    if(sigPromiseTime == null && sigPromiseArea == null && sigPromiseMenu == null) {
        checkSigWrite = 0;
    }

    let sigStatus = 1;
    let sigMatchStatus = 0;

    const connection = await pool.getConnection(async (conn) => conn);

    try {
        if(sigPromiseTime!=null) sigPromiseTime = Date.parse(sigPromiseTime);
         await connection.beginTransaction();

        //이미 시그널 값이 존재하면 time, area, menu update만 해줌
        const findMySignalResult = await signalDao.findMySignal(connection, userIdx);
        console.log("시그널 존재: ", findMySignalResult.length);
        if (findMySignalResult.length > 0)
        {
            console.log("signal update");

            const signalRows = [sigPromiseTime, sigPromiseArea, sigPromiseMenu, userIdx,userIdx]
            const fcmRows = [fcm, userIdx]
            result = await signalDao.updateSignal(connection, signalRows, fcmRows);
        }
        else
        {
            console.log("signal insert");

            const signalRows = [userIdx, sigStatus, sigMatchStatus, sigPromiseTime, sigPromiseArea, sigPromiseMenu, checkSigWrite];
            const fcmRows = [fcm, userIdx]
            result = await signalDao.insertSignal(connection, signalRows, fcmRows);
        }
        await connection.commit();

        return result;
    } catch (err) {
        await connection.rollback();
        logger.error(`App - [1]Signal On dao error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 시그널 정보 수정 4
exports.modifySigList = async function (sigPromiseTime ,sigPromiseArea, sigPromiseMenu, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        let checkSigWrite = 1;

        if(sigPromiseTime == null && sigPromiseArea == null && sigPromiseMenu == null) {
            checkSigWrite = 0;
        }
        
        const params = [sigPromiseTime, sigPromiseArea, sigPromiseMenu, checkSigWrite, userIdx, userIdx];
        const result = await signalDao.updateSignal(connection, params);
        connection.release();

        //return response(baseResponse.SUCCESS);
        return result;

    } catch (err) {
        logger.error(`App - modifySigList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 시그널 off 5
exports.signalOff = async function (userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await signalDao.signalOff(connection, userIdx);

        connection.release;
        return result;
    } catch (err) {
        logger.error(`App - signalOff Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 시그널 리스트 신청 6
exports.signalApply = async function (userIdx, applyedIdx) {
    try {
        const params = [userIdx, applyedIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await signalDao.postSignalApply(connection, params);
        connection.release;
        return result;
    } catch (err) {
        logger.error(`App - signalApply Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 시그널 신청 취소 9
exports.cancelSignalApply = async function (applyedIdx, userIdx) {
    try {
        const params = [userIdx,applyedIdx];
        const params2 = [applyedIdx,userIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await signalDao.cancelSignalApply(connection, params);
        const result2 = await signalDao.cancelSignalApply(connection,params2);
        connection.release;
        return result;
    } catch (err) {
        logger.error(`App - cancelSignalApply Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// Signal Promise Area, Time 수정
exports.signalContents = async function (userIdx, sigPromiseTime, sigPromiseArea) {
    try {
        const params = [sigPromiseTime, sigPromiseArea, userIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await signalDao.modifySignalContents(connection, params);
        connection.release;
        return result;
    } catch (err) {
        logger.error(`App - modifySignalContents Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


// 매칭 상대 업데이트
exports.matching = async function (applyIdx, applyedIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        //user = applyedIdx: 시그널 수락자
        //apply = applyIdx : 시그널 신청자

        //시그널 수락자, 신청자 둘다 signalApply table에서 전부 삭제
        params = [applyIdx, applyedIdx, applyIdx, applyedIdx]
        const result = await signalDao.deleteSignalApply(connection, params);

        //수락자 정보가 없으면 신청자 정보로 대체

        //시그널 수락자의 signal상태 sigStatus = 0, sigMatchStatus = 1로 변경 후
        //applyedIdx 입력
        params = [applyIdx, applyedIdx]
        const result3 = await signalDao.updateSigMatch(connection, params);

         //시그널 신청자는 Signaling에서 삭제
        const result4 = await signalDao.signalOff(connection, applyIdx);

        connection.release;

        return result;
    } catch (err) {
        logger.error(`App - matching Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
