const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");

const msgDao = require("./msgDao");

const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

// 쪽지 방 생성
exports.createMsgRoom = async function (userIdx, matchIdx, roomId) {
    try {
        const params = [userIdx, matchIdx, roomId];
        const connection = await pool.getConnection(async (conn) => conn);

        const createRoomResult = await msgDao.createMsgRoom(connection, params);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - createMsgRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 채팅 보내기
exports.sendMsg = async function (roomId, senderIdx, msg) {
    try {
        const params = [roomId, senderIdx, msg];
        const connection = await pool.getConnection(async (conn) => conn);
        //console.log(msg);

        const sendMsgResult = await msgDao.sendMsg(connection, params);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - sendMsg Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 쪽지 방 삭제
exports.deleteMsg = async function (roomId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const deleteMsgResult = await msgDao.deleteMsg(connection, roomId);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - deleteMsg Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 쪽지 나간 사람 dummy로 변경
exports.updateExitUserIdx = async function (roomId, remain, type) {
    try {
        var params;

        if(type == 1) {
            params = [7, remain, roomId];
        } else if(type == 2) {
            params = [remain, 7, roomId];
        }

        const connection = await pool.getConnection(async (conn) => conn);

        const updateExitUserIdx = await msgDao.updateExitUserIdx(connection, params);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - updateExitUserIdx Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
//약속 장소 생성
exports.createPromise = async function (where,when,menu,userIdx,roomId){
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const params = [where, when, menu,userIdx,roomId];
        const createResult = await msgDao.createPromise(connection,params);

        connection.release();

        return createResult;
    }
    catch (err){
        logger.error(`App - createPromise Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
