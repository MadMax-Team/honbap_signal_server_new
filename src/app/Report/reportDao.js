/*
*******************
    REPORT
    -----------
    userIdx
    reportedIdx
    shortReason
    specificReason
    createdAt
    clear
*******************
*/

// 1. 신고 등록
async function insertReport(connection, params) {
    const query =   `
                    INSERT INTO Report
                    (userIdx, shortReason, specificReason)
                    VALUES (?, ?, ?);
                    `;
    const [row] = await connection.query(query, params);
    return row;
}

module.exports = {
    insertReport,   // 1
};
