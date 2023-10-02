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
exports.createSignal = async function (sigPromiseTime, sigPromiseArea, sigPromiseMenu, userIdx) {
    try {
        let checkSigWrite = 1;

        if(sigPromiseTime == null && sigPromiseArea == null && sigPromiseMenu == null) {
            checkSigWrite = 0;
        }

        let sigStatus = 1;
        let sigMatchStatus = 0;

        const signalRows = [userIdx, sigStatus, sigMatchStatus, sigPromiseTime, sigPromiseArea, sigPromiseMenu, checkSigWrite];
        const connection = await pool.getConnection(async (conn) => conn);
        
        const createSignalResult = await signalDao.insertSignal(connection, signalRows);

        connection.release();
        return createSignalResult;
    }
    catch (err) {
        logger.error(`App - createSignal Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 시그널 정보 수정 4
exports.modifySigList = async function (sigPromiseTime ,sigPromiseArea, sigPromiseMenu, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const params = [sigPromiseTime, sigPromiseArea, sigPromiseMenu, userIdx];
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
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await signalDao.cancelSignalApply(connection, params);
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
exports.matching = async function (matchIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();
        const params = [matchIdx, userIdx];
        const user = userIdx;

        //시그널 수락자, 신청자 둘다 상태 변경해줘야함
        //signalApply table에서 전부 삭제 ()
        //const result2 = await signalDao.deleteSignalApply(connection, user);

        //signal상태 sigStatus = 0, sigMatchStatus = 1로 변경
        const result = await signalDao.updateSigMatch(connection, params);
        
        await connection.commit();

        connection.release();
        return result;
    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error(`App - matching Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
