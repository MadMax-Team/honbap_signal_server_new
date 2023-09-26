const baseResponse = require("../../../config/baseResponseStatus");

async function insertUserLocation(connection, params) {
  const query = `
                  INSERT INTO UserLocation(userIdx)
                  VALUES(?);
                `;
  const row = await connection.execute(query, params);
  return baseResponse.SUCCESS;
}

async function updateLocation(connection, params) {
  const query = `
                UPDATE UserLocation
                SET latitude = ?, longitude = ?
                WHERE userIdx = ?;
                `;
  const [row] = await connection.query(query, params);

  return row;
}

async function getLocation(connection, userIdx) {
  const query = `
                  SELECT *
                  FROM UserLocation
                  WHERE userIdx = ?;
                `;
  const [row] = await connection.query(query, userIdx);

  return row;
}

async function getSignalOnUser(connection, params){
  const query = `
                  SELECT u.*, up.nickName, s.signalIdx, s.sigPromiseArea, s.sigPromiseTime, s.checkSigWrite, s.sigPromiseMenu
                  FROM Signaling AS s
                          LEFT JOIN User AS u ON s.userIdx = u.userIdx
                          LEFT JOIN UserProfile AS up ON s.userIdx = up.userIdx
                  WHERE s.sigStatus = 1;
                `;
  const [row] = await connection.query(query, params);
  return row ;
}


module.exports = {
  insertUserLocation,
  updateLocation, 
  getLocation, 
  getSignalOnUser
};