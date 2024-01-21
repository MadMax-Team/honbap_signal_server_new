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
                  SELECT latitude, longitude
                  FROM UserLocation
                  WHERE userIdx = ?;
                `;
  const [row] = await connection.query(query, userIdx);

  return row;
}

async function getSignalOnUsers(connection){
  const query = `
                  SELECT u.*, up.*, s.signalIdx, s.sigPromiseArea, s.sigPromiseTime, s.checkSigWrite, s.sigPromiseMenu, ul.latitude, ul.longitude
                  FROM Signaling AS s
                          LEFT JOIN User AS u ON s.userIdx = u.userIdx
                          LEFT JOIN UserProfile AS up ON s.userIdx = up.userIdx
                          LEFT JOIN UserLocation As ul ON s.userIdx = ul.userIdx
                  WHERE s.sigStatus = 1 and s.sigMatchStatus = 0
                `;
  const [row] = await connection.query(query);
  return row ;
}


module.exports = {
  insertUserLocation,
  updateLocation, 
  getLocation, 
  getSignalOnUsers
};