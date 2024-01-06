const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const findDao = require("./findDao");
const haversine = require('haversine');

exports.getSignalList = async function (userIdx) 
{
    const connection = await pool.getConnection(async (conn) => conn);
    // const params = [userIdx, userIdx, userIdx];
    const myLocation = await findDao.getLocation(connection, userIdx);
    let signalOnUserList = await findDao.getSignalOnUsers(connection);
    if(!signalOnUserList) return signalOnList;
    signalOnUserList = Array.from(new Set(signalOnUserList.map(item => item.userIdx))).map(userIdx => {
      return signalOnUserList.find(obj => obj.userIdx === userIdx);
    }); // 중복 제거
    
    let nearUsers = [];

    for(const signalOnUser of signalOnUserList) {
    
      if(signalOnUser.userIdx === userIdx) continue;
  
      const distance = haversine(myLocation[0], {latitude: signalOnUser.latitude, longitude: signalOnUser.longitude}, { unit: 'km' });
      
      if (distance <= 10) {
        
        const userWithDistance = {
          ...signalOnUser,
          distance: distance  // 거리 정보 추가
        };
        
        nearUsers.push(userWithDistance);
      }
    };
    logger.info(JSON.stringify(nearUsers));
    
    nearUsers.length = 0;
    connection.release();
    
    return nearUsers;
}
