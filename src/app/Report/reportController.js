const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");

//const reportProvider = require("../../app/Signal/signalProvider");
const reportService = require("../../app/Report/reportService");

const { response, errResponse } = require("../../../config/response");
const logger = require("../../../config/winston");
const crypto = require("crypto");
const regexEmail = require("regex-email");

// 신고 등록
exports.postReport = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    //const userIdx = req.params.userIdx;
    const {shortReason, specificReason} = req.body;

    const signalup = await reportService.createReport(
        userIdxFromJWT, shortReason, specificReason
    );

    return res.send(baseResponse.SUCCESS);
}
