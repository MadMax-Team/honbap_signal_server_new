/*
*** ***
signal table -  userIdx : User.userIdx
                matchIdx : user.userIdx
                signalIdx : for 시그널 체크
                sigStatus : 시그널 on/off 확인
                sigMatchStatus : 시그널 숨김/열림 확인
                sigStart : 시그널 시작 시간
                sigPromiseTime : 약속 시간pmw
                sigPromiseArea : 약속 장소
                createAt
                updateAt
*** ***
*/

// 시그널 등록 *** 1 ***
async function insertSignal(connection, params) {
  const query = `
                  INSERT INTO Signaling
                  (userIdx, sigStatus, sigMatchStatus, sigPromiseTime, sigPromiseArea, sigPromiseMenu, checkSigWrite)
                  VALUES (?, ?, ?, ?, ?, ?, ?);
                  `;
  const [row] = await connection.query(query, params);

  return row;
}

// 시그널 상태 조회 *** 2 ***
async function getSignalStatus(connection, userIdx) {
  const query = `
                    SELECT s.sigStatus, s.sigMatchStatus
                    FROM Signaling AS s
                    WHERE s.userIdx = ?; 
  `
  const [row] = await connection.query(query, userIdx);
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

// 시그널 정보 수정 *** 4 ***
async function updateSignal(connection, params) {
  const query = `
                  UPDATE Signaling
                  SET sigPromiseTime = ?, sigPromiseArea = ?, sigPromiseMenu = ?, sigStart = ?, updateAt = default
                  WHERE userIdx = ? AND sigStatus = 1 AND sigMatchStatus = 0;
                  `;
  const [row] = await connection.query(query, params);

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
      SELECT DISTINCT applyedIdx
      FROM Signaling AS s, SignalApply AS sa
      WHERE s.sigStatus = 1 AND s.sigMatchStatus = 0 AND sa.userIdx = ?;
                `;
  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 신청 리스트 조회 *** 8 ***
async function getSignalApplyed(connection, userIdx) {
  const query = `
      SELECT DISTINCT applyedIdx
      FROM Signaling AS s, SignalApply AS sa
      WHERE s.sigStatus = 1 AND s.sigMatchStatus = 0 AND sa.applyedIdx = ?;
                `;
  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 신청 리스트 삭제 (자동) *** 10 ***
async function deleteSignalApply(connection, userIdx) {
  const query = `
                    DELETE FROM SignalApply
                    WHERE userIdx = ?;
                    `;
  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 신청 취소 *** 9 ***
async function cancelSignalApply(connection, params) {
  const query = `
                    DELETE FROM SignalApply
                    WHERE userIdx = ? OR applyedIdx = ?;
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
                  SET matchIdx = ?, sigStatus = 0, sigMatchStatus = 1
                  WHERE userIdx = ? AND sigStatus = 1;
                  `;
  const [row] = await connection.query(query, params);

  return row;
}

module.exports = {
  insertSignal, // 1
  getSignalStatus, // 2
  getSignalInfo, //3
  updateSignal, // 4
  updateSigMatch, //
  signalOff, // 5
  postSignalApply, // 8
  getSignalApply, // 9
  getSignalApplyed,
  deleteSignalApply, // 10
  cancelSignalApply, // 11
  endSignals, // 12
  mySignal, // 13
  arzoneList, // 14
  modifySignalContents, //15
  getInfoFromNickName, //16
};
