const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const findDao = require("./findDao");

exports.createUserLocation = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertUserLocationParams = [userIdx];

    const locationResult = await findDao.insertUserLocation(connection, insertUserLocationParams);

    // logger.info(`유저 위치 등록 시 등록된 유저 index : ${locationResult[0].userIdx}`);
    connection.release();
    return locationResult
  } 
  catch (err) {
    logger.error(`App - createUserLocation Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  } 
};

exports.updateLocation = async function(latitude, longitude, userIdx) {
  try {
      const connection = await pool.getConnection(async (conn) => conn);

      const result = await findDao.updateLocation(connection, latitude, longitude, userIdx);

      connection.release();
      return result;
  } catch (err) {
      logger.error(`App - updateLocation Service error\n: ${err.message}`);
      return errResponse(baseResponse.DB_ERROR);
  }
}