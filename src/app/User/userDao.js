// 데이터 가져오기 원본

//=========================================================
// 회원가입 API
// user ID 체크 *** 1 ***
async function existUserId(connection, userId) {
    const query = `
                  SELECT userId
                  FROM User
                  WHERE userId = ?;
                  `;

    const [row] = await connection.query(query, userId);

    return row;
}

// 이메일 체크 *** 2 ***
async function existUserEmail(connection, email) {

    const query = `
                  SELECT email
                  FROM User
                  WHERE User.email = ?;
                  `;

    const [row] = await connection.query(query, email);
    return row;
}

// 핸드폰 번호 체크 *** 3 ***
async function existUserPhone(connection, phoneNum) {
    const query = `
                  SELECT phoneNum
                  FROM User
                  WHERE phoneNum = ?;
                  `;

    const [row] = await connection.query(query, phoneNum);

    return row;
}

// email 회원 조회 *** 4 ***
async function selectUserId(connection, email) {
    const query = `
                   SELECT userName
                   FROM User
                   WHERE email = ?;
                   `;
    const [row] = await connection.query(query, email);
    return row;
}

// 회원가입 *** 5 ***
async function insertUserInfo(connection, params) {
    const query = `
        INSERT INTO
            User(email, password, userName, birth, phoneNum, sex)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    const [row] = await connection.query(query, params);

    return row;
}

// 유저 인덱스 조회 *** 6 ***
async function selectUserIdx(connection, email) {
    const query = `
                  SELECT userIdx
                  FROM User
                  WHERE email = ?;
                  `;

    const [row]= await connection.query(query, email);

    return row;
}

// 유저 개인 정보 수정 *** 7 ***
async function updateUserInfo(connection, params) {
    const query = `
                  UPDATE User 
                  SET userName = ?, birth = ?, updateAt = default  
                  WHERE userIdx = ?;
                  `;

    const row = await connection.query(query, params);

    return row;
}

//==================================================
// user profile

// 유저 프로필 입력 *** 8 ***
async function insertUserProfile(connection, params) {
    const query = `
                  INSERT INTO UserProfile
                  (userIdx, profileImg, taste, hateFood, interest, avgSpeed, preferArea, mbti, userIntroduce)
                  VALUES
                  (?, ?, ?, ?, ?, ?, ?, ?, ?);
                  `;
    const [row] = await connection.query(query, params);

    return row;
}

// 유저 위치 초기 생성 (자동) *** 8_2 ***
async function createUserLocation(connection, userIdx) {
    const query = `
                  INSERT INTO UserLocation
                  (userIdx) VALUES (?);
                  `;
    const [row] = await connection.query(query, userIdx);
    return row;
}

// 매너 온도 초기 설정 (자동) *** 8_3 ***
async function createUserManner(connection, userIdx) {
    const query =   `
                    INSERT INTO Manner
                    (userIdx) VALUES (?);
                    `;
    const [row] = await connection.query(query, userIdx);
    return row;
}

// 닉네임 체크 *** 9 ***
async function existUserNickname(connection, nickName) {
    const query = `
                  SELECT nickName,userIdx
                  FROM UserProfile
                  WHERE nickName = ?;
                  `;
    const [row] = await connection.query(query, nickName);

    return row;
}

// 유저 개인정보 조회 *** 10 ***
//유저id 없어져서 지움
async function selectUserInfo(connection, userIdx) {
    const query = `
                  SELECT email, userName, birth,
                         phoneNum, sex, updateAt, createAt
                  FROM User
                  WHERE userIdx = ?;
                  `;
    const [row] = await connection.query(query, userIdx);
    return row;
}


// 유저 마이페이지 조회 *** 11 ***
async function selectUserProfile(connection, userIdx) {
    const query = `
                  SELECT nickName,profileImg, taste, hateFood, interest,
                         avgSpeed, preferArea, mbti, userIntroduce, updateAt
                  FROM UserProfile
                  WHERE userIdx = ?;
                  `;
    const [row] = await connection.query(query, userIdx);
    return row;
}

// 유저 패스워드 수정 *** 12 ***
async function updatePassword(connection, password, userIdx) {
    const query = `
                  UPDATE User
                  SET password = ?
                  WHERE userIdx = ?;
                  `;
    const [row] = await connection.query(query, password, userIdx);

    return row;
}

// 유저 프로필(마이페이지) 수정 *** 13 ***
async function updateUserProfile(connection, params) {
    const query = `
                  UPDATE UserProfile
                  SET nickName = ?,profileImg = ?, taste = ?, hateFood = ?, 
                      interest = ?, avgSpeed = ?, preferArea = ?,
                      mbti = ?, userIntroduce = ?, updateAt = default
                  WHERE userIdx = ?;
                  `;
    const [row] = await connection.query(query, params);
    return row;
    //USER 테이블에 없는 코드
    //UPDATE User
    //SET profileInserted = 1
    //WHERE userIdx = ?;
}

// 비밀번호 검사 *** 14 ***
async function checkpassword(connection, params) {
    const query = `
                  SELECT password
                  FROM User
                  WHERE email = ? and password = ?;
                  `;

    const [row] = await connection.query(query, params);

    return row;
}

// 카카오 계정 조회 *** 15 ***
async function selectKakaoId(connection, params) {
    const query = `
                SELECT id
                FROM User
                WHERE provider = ? and id = ?;
                `;

    const [row] = await connection.query(query, params);

    return row;
}
//프로필 사진 수정
async function updateUserImage(connection,params){
    const query =`
                UPDATE UserProfile
                SET profileImg = ?
                WHERE userIdx = ?;
                `;
    const [row] = await connection.query(query,params);

    return row;

}
//유저 프로필 null 값으로 채워넣기
async function insertUsernull(connection, userIdx) {
    const query =   `
                    INSERT INTO UserProfile
                    (userIdx) VALUES (?);
                    `;
    const [row] = await connection.query(query, userIdx);
    return row;
}


//회원가입할때 프로필 널값 넣기
async function insertUsernull(connection,idx){
    const query = `
                INSERT INTO UserProfile
                (userIdx)
                VALUES (?);
                `;
    const [row] = await connection.query(query,idx);

    return row;
}

async function upateFCMById(connection,params){
    const query =`
                UPDATE User
                SET fcm = ?
                WHERE userIdx = ?;
                `;
    const [row] = await connection.query(query,params);

    return row;
}

async function selectFCM(connection, params) {
    const query = `
                SELECT fcm
                FROM User
                WHERE userIdx = ?;
                `;

    const [row] = await connection.query(query, params);

    return row;
}


module.exports = {
    existUserId, // 1
    existUserEmail, // 2
    existUserPhone, // 3
    selectUserId, // 4
    insertUserInfo, // 5
    selectUserIdx, // 6
    updateUserInfo, // 7
    insertUserProfile, // 8
    createUserLocation, // 8_2 - UserLocation
    createUserManner, // 8_3 - Manner
    existUserNickname, // 9
    selectUserInfo, // 10
    selectUserProfile, // 11
    updatePassword, // 12
    updateUserProfile, // 13
    checkpassword, //14
    selectKakaoId, //15
    updateUserImage, // 16
    insertUsernull, //17
    upateFCMById, // 18
    selectFCM // 19
  };
