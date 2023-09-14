const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");

//const reportProvider = require("./reportProvider");
const reportDao = require("./reportDao");

const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const { connect } = require("http2");


// 신고 등록
exports.createReport = async function (userIdxFromJWT, reportedIdx, shortReason, specificReason) {
    try {
        const params = [userIdxFromJWT, reportedIdx, shortReason, specificReason];
        const connection = await pool.getConnection(async (conn) => conn);
        
        const createSignalResult = await reportDao.insertReport(connection, params);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - createReport Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
