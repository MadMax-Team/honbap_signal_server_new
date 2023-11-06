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

    const loginUserLocation = await findDao.getLocation(connection, userIdx);
    
    
    const nearSignalOnList = [];

    for(var i=0; i < signalOnUserIdxList.length; i++)
    {
      logger.info("--------------------------------");
      let signalOnUserLocation  = await findDao.getLocation(connection, signalOnUserIdxList[i].userIdx); 
      
      logger.info(signalOnUserIdxList[i].userIdx);
      logger.info(signalOnUserLocation[0].latitude);
      logger.info(signalOnUserLocation[0].longitude);
      
      let loginUserAndSignalOnUserDistance = haversine(loginUserLocation[0], signalOnUserLocation[0]);
      let nearSignalOnUserList = {};
      if(loginUserAndSignalOnUserDistance < 10 )
      {
        if(signalOnUserIdxList[i].userIdx != userIdx)
        {
          nearSignalOnUserList.userIdx = signalOnUserIdxList[i].userIdx;
          nearSignalOnUserList.checkSigWrite = signalOnUserIdxList[i].checkSigWrite;
          nearSignalOnUserList.userName = signalOnUserIdxList[i].userName;
          nearSignalOnUserList.userIntroduce = signalOnUserIdxList[i].userIntroduce;
          nearSignalOnUserList.taste = signalOnUserIdxList[i].taste;
          nearSignalOnUserList.hatefood = signalOnUserIdxList[i].hatefood;
          nearSignalOnUserList.interest = signalOnUserIdxList[i].interest;
          nearSignalOnUserList.avgSpeed = signalOnUserIdxList[i].avgSpeed;
          nearSignalOnUserList.preferArea = signalOnUserIdxList[i].preferArea;
          nearSignalOnUserList.mbti = signalOnUserIdxList[i].mbti;
          nearSignalOnUserList.updateAt = signalOnUserIdxList[i].updateAt;
          nearSignalOnUserList.sigPromiseArea = signalOnUserIdxList[i].sigPromiseArea;
          nearSignalOnUserList.sigPromiseTime = signalOnUserIdxList[i].sigPromiseTime;
          nearSignalOnUserList.distance = loginUserAndSignalOnUserDistance;
        }
        nearSignalOnList.push(nearSignalOnUserList);
      }
      else if(loginUserAndSignalOnUserDistance > 10)
      {
        logger.info("10km 거리에서 벗어난 시그널 입니다.");
        logger.info("--------------------------------");
      }      
    }
    logger.info(nearSignalOnList);
    connection.release();
    
    return nearSignalOnList;
  } catch (err) {
    logger.error(`findProvider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}