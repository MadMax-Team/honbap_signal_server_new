const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const findDao = require("./findDao");


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