const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");

const findDao = require("./findDao");
const haversine = require('haversine');

exports.getSignalList = async function (userIdx) 
{
  try 
  {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [userIdx, userIdx, userIdx];

    const signalOnUserIdxList = await findDao.getSignalOnUser(connection, params);

    // 접속 유저 최신 위치 정보 불러오기
    const loginUserLocation = await findDao.getLocation(connection, userIdx);

    logger.info("--------------------------------");

    let nearSignalOnUserList = [];

    for(var i=0; i < signalOnUserIdxList.length; i++)
    {
      logger.info("--------------------------------");
      let signalOnUserLocation  = await findDao.getLocation(connection, signalOnUserIdxList[i].userIdx); 
      
      let loginUserAndSignalOnUserDistance = haversine(loginUserLocation[0], signalOnUserLocation[0]);

      if(loginUserAndSignalOnUserDistance > 0 && loginUserAndSignalOnUserDistance < 10 )
      {
        if(signalOnUserIdxList[i].userIdx != userIdx)
        {
          nearSignalOnUserList.push(signalOnUserIdxList[i]);
        }
      }
      else if(distance > 10)
      {
        logger.info("10km 거리에서 벗어난 시그널 입니다.");
        logger.info("--------------------------------");
      }
    }
    connection.release();
    return nearSignalOnUserList;
  } catch (err) {
    logger.error(`findProvider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}