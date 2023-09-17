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

// 시그널 상태 조회
async function getSignalStatus(connection, userIdx) {
  const query = `
                    SELECT s.sigStatus, s.sigMatchStatus
                    FROM Signaling AS s
                    WHERE s.userIdx = userIdx; 
  `
  const [row] = await connection.query(query, userIdx);
  return row;
}

// 켜져 있는 시그널 조회 *** 2 ***
async function selectSignalList(connection, userIdx) {
  const query = `
                    SELECT up1.nickName as userNickName, up2.nickName as matchingNickName,
                    s.sigPromiseTime, s.sigPromiseArea, s.checkSigWrite, s.sigStart, s.updateAt
                    FROM  Signaling AS s
                        LEFT JOIN UserProfile AS up1 ON s.userIdx = up1.userIdx
                        LEFT JOIN UserProfile AS up2 ON s.matchIdx = up2.userIdx
                    WHERE s.userIdx = ? AND s.sigStatus = 1
                    ORDER BY s.signalIdx DESC;
                    `;

  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 정보 조회 
async function getSignalInfo(connection, params) {
  const query = `
                  SELECT s.sigPromiseTime, s.sigPromiseArea, s.sigPromiseMenu
                  FROM Signaling AS s
                  WHERE s.userIdx = ? AND s.sigStatus = 1 AND s.sigMatchStatus = 0;
                `;
  const [row] = await connection.query(query, params);

  return row;             
}

// 시그널 정보 수정 *** 3 ***
async function updateSignal(connection, params) {
  const query = `
                  UPDATE Signaling
                  SET sigPromiseTime = ?, sigPromiseArea = ?, sigPromiseMenu = ?, sigStart = ?, updateAt = default
                  WHERE userIdx = ? AND sigStatus = 1 AND sigMatchStatus = 0;
                  `;
  const [row] = await connection.query(query, params);

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

// 시그널 OFF *** 5 ***
async function signalOff(connection, userIdx) {
  const query = `
                  DELETE FROM Signaling
                  WHERE sigStatus = 1 AND userIdx = ? AND sigMatchStatus = 0;
                  `;

  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 리스트에서 삭제 *** 6 ***
async function deleteSignal(connection, params) {
  const query = `
                  DELETE FROM Signaling
                  WHERE signalIdx = ? AND userIdx = ?;
                  `;
  const [row] = await connection.query(query, params);
  return row;
}

// 시그널 ON *** 7 ***
async function signalOn(connection, userIdx) {
  const query = `
                  UPDATE Signaling
                  SET sigStatus = 1
                  WHERE sigStatus = 0 AND userIdx = ?;
                  `;

  const [row] = await connection.query(query, userIdx);
  return row;
}

// 시그널 리스트 신청 *** 8 ***
async function postSignalApply(connection, params) {
  const query = `
                    INSERT INTO SignalApply
                    (userIdx, applyedIdx) 
                    VALUES (?, ?);
                    `;
  const [row] = await connection.query(query, params);
  return row;
}

// 시그널 신청 리스트 조회 *** 9 ***
// 닉네임이라는 거 없어서 테스트 위해서 userName 으로 변경후 실행
// applyIdx 와 applyTime 차이점이 있는건지 모르겟음.. 일단 applytTime 속성 없어서 정렬 제외하고 실행
async function getSignalApply(connection, userIdx) {
  const query = `
                  SELECT DISTINCT userIdx
                  FROM Signaling AS s, SignalApply AS sa, User AS up
                  WHERE s.sigStatus = 1 AND s.sigMatchStatus = 0 AND sa.userIdx = ? AND 
                          sa.applyedIdx = up.userIdx;
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

// 시그널 신청 취소 *** 11 ***
async function cancelSignalApply(connection, params) {
  const query = `
                    DELETE FROM SignalApply
                    WHERE userIdx = ? OR applyedIdx = ?;
                    `;
  const [row] = await connection.query(query, params);
  return row;
}

// 이전 시그널들 조회 *** 12 ***
async function endSignals(connection, params) {
  const query = `
                    SELECT up1.nickName, up2.nickName, s.sigPromiseArea, s.sigPromiseTime
                    FROM    Signaling AS s
                            right join User AS up1 ON s.userIdx = up1.userIdx
                            right join User AS up2 ON s.matchIdx = up2.userIdx
                    WHERE (s.userIdx = ? OR s.matchIdx = ?) AND s.sigStatus = 0;
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



module.exports = {
  insertSignal, // 1
  getSignalStatus,
  selectSignalList, // 2
  getSignalInfo,
  updateSignal, // 3
  updateSigMatch, // 4
  signalOff, // 5
  deleteSignal, // 6
  signalOn, // 7
  postSignalApply, // 8
  getSignalApply, // 9
  deleteSignalApply, // 10
  cancelSignalApply, // 11
  endSignals, // 12
  mySignal, // 13
  arzoneList, // 14
  modifySignalContents, //15
  getInfoFromNickName, //16
};
