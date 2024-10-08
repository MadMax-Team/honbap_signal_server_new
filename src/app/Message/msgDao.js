
// 쪽지 방 생성 *** 1 ***
async function createMsgRoom(connection, params) {
    const query =   `
                    INSERT INTO MessageRoom(userIdx, matchIdx, roomId)
                    VALUES(?,?,?);
                    `;

    const [row] = await connection.query(query, params);

    return row;
}

// 쪽지 방 확인 *** 2 ***
async function getMsgRoom(connection, params) {
    const query =   `                    
        SELECT  m.roomId ,u.nickName , u.profileImg, MM.msg as lastMessage , MM.sendAt as lastSendedAt
        FROM MessageRoom AS m
            LEFT JOIN Message AS MM ON m.roomId = MM.roomId AND (MM.roomId,MM.sendAt) in (select roomId,MAX(sendAt) from Message group by roomId)
            LEFT JOIN UserProfile As u ON u.userIdx = (CASE
                WHEN m.userIdx = ? THEN m.matchIdx
                WHEN m.userIdx != ? THEN m.userIdx
                END)
        WHERE (m.userIdx = ? OR m.matchIdx=?)
        ORDER BY MM.sendAt DESC

    `;

    const [row] = await connection.query(query, params);

    return row;
}

// 쪽지 보내기 *** 3 ***
async function sendMsg(connection, params) {
    const query =   `
                    INSERT INTO Message(roomId, senderIdx, msg)
                    VALUES(?,?,?);
                    `;

    const [row] = await connection.query(query, params);

    return row;
}

// 쪽지 확인 *** 4 ***
async function getMsg(connection, params) {
    const query =   `
                    SELECT 
                        (CASE
                            WHEN senderIdx = ? THEN 'send'
                            WHEN senderIdx = ? THEN 'receive'
                        END) AS status, msg, sendAt
                    FROM Message
                    WHERE roomId = ?
                    ORDER BY sendAt ASC;
                    `;

    const [row] = await connection.query(query, params);

    return row;
}

// 쪽지 방에 남아있는 index 확인 *** 5 ***
async function getRoomIdx(connection, roomId) {
    const query =   `
                    SELECT userIdx, matchIdx
                    FROM MessageRoom
                    WHERE roomId = ?
                    `
    const [row] = await connection.query(query, roomId);
    return row;
}

// 쪽지 방 나간 사람 dummy로 변경 *** 6 ***
async function updateExitUserIdx(connection, params) {
    const query =   `
                    UPDATE MessageRoom
                    SET userIdx = ?, matchIdx = ?
                    WHERE roomId = ?;
                    `;
    const [row] = await connection.query(query, params);
    return row;
}

// 쪽지 방 삭제 *** 7 ***
async function deleteMsg(connection, roomId) {
    const query =   `
                    DELETE FROM MessageRoom
                    WHERE roomId = ?;
                    `;
    const [row] = await connection.query(query, roomId);

    return row;
}
//약속 생성 *** 8 *** update 로 짜야할지 고민
async function createPromise(connection,params) {
    const query = `
        UPDATE MessageRoom
        SET new_where = ?, new_when = ?, menu  = ?
        WHERE (userIdx = ? OR matchIdx = ?) AND roomId = ?;
    `;
    const [row] = await connection.query(query, params);
    return row;
}

module.exports = {
    createMsgRoom,      // 1
    getMsgRoom,         // 2
    sendMsg,            // 3
    getMsg,             // 4
    getRoomIdx,         // 5
    updateExitUserIdx,  // 6
    deleteMsg,          // 7
    createPromise,      //8
};
