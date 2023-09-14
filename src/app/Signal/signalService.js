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


// 시그널 등록
exports.createSignal = async function (userIdx, sigPromiseTime, sigPromiseArea) {
    try {
        let checkSigWrite = 1;

        if(sigPromiseTime == null && sigPromiseArea == null) {
            checkSigWrite = 0;
        }

        let sigStatus = 1;
        let sigMatchStatus = 0;

        const signalRows = [userIdx, sigStatus, sigMatchStatus, sigPromiseTime, sigPromiseArea, checkSigWrite];
        const connection = await pool.getConnection(async (conn) => conn);
        
        const createSignalResult = await signalDao.insertSignal(connection, signalRows);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - createSignal Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 시그널 정보 수정
exports.modifySigList = async function (sigPromiseTime ,sigPromiseArea, sigStart, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const params = [sigPromiseTime, sigPromiseArea, sigStart, userIdx];
        const result = await signalDao.updateSignal(connection, params);
        connection.release();

        //return response(baseResponse.SUCCESS);
        return result;

    } catch (err) {
        logger.error(`App - modifySigList Service error\n: ${err.message}`);
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

        const result = await signalDao.updateSigMatch(connection, params);
        //const result2 = await signalDao.deleteSignalApply(connection, user);

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

// 시그널 off
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

// 시그널 삭제
exports.deleteSignalList = async function (signalIdx, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const params = [signalIdx, userIdx];
        const result = await signalDao.deleteSignal(connection, params);
        connection.release();

        return result;
    } catch(err) {
        logger.error(`App - deleteSignalList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 시그널 on
exports.signalOn = async function (userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await signalDao.signalOn(connection, userIdx);

        connection.release;
        return result;
    } catch (err) {
        logger.error(`App - signalOn Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 시그널 리스트 신청
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

// 시그널 신청 취소
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