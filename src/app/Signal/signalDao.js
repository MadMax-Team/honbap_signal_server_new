/*
*** ***
signal table -  userIdx : User.userIdx
                matchIdx : user.userIdx
                signalIdx : for 시그널 체크
                sigStatus : 시그널 on/off 확인
                sigMatchStatus : 시그널 숨김/열림 확인
                sigPromiseTime : 약속 시간pmw
                sigPromiseArea : 약속 장소
                createAt : 시그널 on 시간
                updateAt : 시그널 on 업데이트 시간
*** ***
*/

// 시그널 등록 *** 1 ***
async function insertSignal(connection, params, params2) {
  const query = `
                  INSERT INTO Signaling
                  (userIdx, sigStatus, sigMatchStatus, sigPromiseTime, sigPromiseArea, sigPromiseMenu, checkSigWrite)
                  VALUES (?, ?, ?, ?, ?, ?, ?);
                  `;
  const [row] = await connection.query(query, params);
  console.log("row", row);

  const query2 = `
                    UPDATE User
                    set fcm = ?
                    WHERE userIdx = ?;
                `;
  const [row2] = await connection.query(query2, params2);
  console.log("row2", row2);

  return row;
}

async function findMySignal(connection, userIdx) {
  const query = `
                    SELECT s.userIdx
                    FROM Signaling AS s
                    WHERE s.userIdx = ? AND ((s.sigStatus = 1 AND s.sigMatchStatus = 0) OR (s.sigStatus = 0 AND s.sigMatchStatus = 0));
                    `;
  const [row] = await connection.query(query, userIdx);
  return row;   
}

// 시그널 상태 조회 *** 2 ***
async function getSignalStatus(connection, params) {
  const query = `
      SELECT s.*, u.userName
      FROM Signaling AS s, User AS u
      WHERE NOT (s.sigStatus = 1 AND s.sigMatchStatus = 1) 
      AND (s.userIdx = ? OR s.applyedIdx = ?) AND u.userIdx = ?;
  `
  const [row] = await connection.query(query, params);

  const query2 = `
  SELECT u.userName
  FROM User AS u
  WHERE u.userIdx = ?;
  `
  if (row.length != 0 && row[0].applyedIdx != null && row[0].userIdx == params[0])
  {
    const [row2] = await connection.query(query2, row[0].applyedIdx);
    row[0].userName = row2[0].userName;
  }
  else if (row.length != 0 && row[0].applyedIdx != null && row[0].applyedIdx == params[0])
  {
    const [row2] = await connection.query(query2, row[0].userIdx);
    row[0].userName = row2[0].userName;
  }

  return row;
}

// 시그널 정보 조회 *** 3 ***
async function getSignalInfo(connection, params) {
  const query = `
                  SELECT s.sigPromiseTime, s.sigPromiseArea, s.sigPromiseMenu
                  FROM Signaling AS s
                  WHERE s.userIdx = ? AND s.sigStatus = 1 AND s.sigMatchStatus = 0;
                `;
  const [row] = await connection.query(query, params);

  return row;             
}

// 시그널 매칭 조회 *** 3 ***
async function getMatchInfo(connection, params) {
  const query = `
                  SELECT s.sigPromiseTime, s.sigPromiseArea, s.sigPromiseMenu
                  FROM Signaling AS s
                  WHERE s.userIdx = ? AND s.sigStatus = 0 AND s.sigMatchStatus = 1;
                `;
  const [row] = await connection.query(query, params);

  return row;             
}

// 시그널 정보 수정 *** 4 ***
async function updateSignal(connection, params, params2) {
  const query = `
                  UPDATE Signaling
                  SET sigPromiseTime = ?, sigPromiseArea = ?, sigPromiseMenu = ?, updateAt = DEFAULT
                  WHERE userIdx = ? AND ((sigStatus = 1 AND sigMatchStatus = 0) OR sigStatus = 0);
                  `;
  const [row] = await connection.query(query, params);

  const query2 = 
              `
                UPDATE User
                SET fcm = ?
                WHERE userIdx = ?;
              `
  const [row2] = await connection.query(query2, params2);
  
  return row;
}

// 시그널 OFF *** 5 ***
async function signalOff(connection, userIdx) {
  const query = `
                  DELETE FROM Signaling
                  WHERE sigStatus = 1 AND userIdx = ? AND sigMatchStatus = 0;
                  `;

  const [row] = await connection.query(query, userIdx);
  return row;
}


// 시그널 리스트 신청 *** 6 ***
async function postSignalApply(connection, params) {
  const query = `
                    INSERT INTO SignalApply
                    (userIdx, applyedIdx) 
                    VALUES (?, ?);
                    `;
  const [row] = await connection.query(query, params);
  return row;
}

// 시그널 신청 리스트 조회 *** 7 ***
async function getSignalApply(connection, userIdx) {
  const query = `
      SELECT DISTINCT sa.applyedIdx, u.nickName, u.profileImg
      FROM Signaling AS s, SignalApply AS sa
      INNER JOIN UserProfile AS u ON u.userIdx = sa.applyedIdx
      WHERE s.sigStatus = 1 AND s.sigMatchStatus = 0 AND sa.userIdx = ?;
                `;
  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 신청 리스트 조회 *** 8 ***
async function getSignalApplyed(connection, userIdx) {
  const query = `
      SELECT DISTINCT sa.userIdx, u.nickName, u.profileImg
      FROM Signaling AS s, SignalApply AS sa
      INNER JOIN UserProfile AS u ON u.userIdx = sa.userIdx
      WHERE s.sigStatus = 1 AND s.sigMatchStatus = 0 AND sa.applyedIdx = ?;
                `;
  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 신청 리스트 삭제 *** 10 ***
async function deleteSignalApply(connection, params) {
    const query = `
      DELETE FROM SignalApply
      WHERE userIdx IN (?, ?) OR applyedIdx IN (?, ?);
    `;
    const [row] = await connection.query(query, params);
    return row;
}

// 시그널 신청 취소 *** 9 ***
async function cancelSignalApply(connection, params) {
  const query = `
                    DELETE FROM SignalApply
                    WHERE userIdx = ? AND applyedIdx = ?;
                    `;
  const [row] = await connection.query(query, params);
  return row;
}

async function mySignal(connection, params) {
  const query = `
                    SELECT signalIdx
                    FROM  Signaling
                    WHERE userIdx = ? AND sigMatchStatus = 0;
                    `;
  const [row] = await connection.query(query, params);
  return row;
}

// ARzone locations에 sigPromiseArea가 있는지 조회 ***13***
async function arzoneList(connection, arzoneList) {
  const query = `
                SELECT address
                FROM ARzone
                WHERE address = ?;
                `;
  const [row] = await connection.query(query, arzoneList);
  return row;
}


async function modifySignalContents(connection, params){
  const query = `
                  UPDATE Signaling
                  SET sigPromiseTime = ?, sigPromiseArea = ?
                  where userIdx = ?;
                `;
  const [row] = await connection.query(query, params);
  return row;
}

// 해당 닉네임의 유저 정보 조회 ***16***
async function getInfoFromNickName(connection, nickName) {
  const query = `
                SELECT up.*, u.nickName
                FROM User as u
                    left join (select up.* from UserProfile as up) up on up.userIdx = u.userIdx
                WHERE u.nickName = ?;
  `
  const [row] = await connection.query(query, nickName);
  return row;
}

// 시그널 매칭 상대 업데이트 *** 4 ***
async function updateSigMatch(connection, params) {
  const query =   `
                  UPDATE Signaling
                  SET sigStatus = 0, sigMatchStatus = 1, applyedIdx = ?
                  WHERE userIdx = ? AND sigStatus = 1 AND sigMatchStatus = 0;
                  `;
  const [row] = await connection.query(query, params);

  return row;
}

async function matchSignal(connection, params) {
  const query = `
                    SELECT *
                    FROM Signaling AS s
                    WHERE (s.userIdx = ? OR s.applyedIdx = ?) 
                    AND s.sigStatus = 0 AND s.sigMatchStatus = 1
                    `;
  const [row] = await connection.query(query, params);
  return row;
}

// 시그널 상태 수정 *** 12 ***
async function patchSignalStatus(connection, userIdx) {
  const query = `
                    UPDATE Signaling
                    SET sigMatchStatus = 0
                    WHERE userIdx = ? AND sigStauts = 1 AND sigMatchStatus = 0; 
  `
  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 매칭 후 저장  *** 14 ***
async function patchSignalSave(connection, userIdx) {
  const query = `
                    UPDATE Signaling
                    SET sigStatus = 1
                    WHERE userIdx = ? AND sigStatus = 0 AND sigMatchStatus = 1; 
  `
  const [row] = await connection.query(query, userIdx);
  return row;
}

module.exports = {
  insertSignal, // 1
  findMySignal,
  getSignalStatus, // 2
  getMatchInfo,
  getSignalInfo, //3
  updateSignal, // 4
  updateSigMatch, //
  signalOff, // 5
  postSignalApply, // 8
  getSignalApply, // 9
  getSignalApplyed,
  deleteSignalApply, // 10\
  cancelSignalApply, // 11
  mySignal, // 13
  arzoneList, // 14
  modifySignalContents, //15
  getInfoFromNickName, //16
  matchSignal,
  patchSignalStatus,
  patchSignalSave
};
