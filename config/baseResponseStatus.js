module.exports = {
  // Success
  SUCCESS: { isSuccess: true, code: 1000, message: "성공" },
  FAIL: { isSuccess: false, code: 1001, message: "실패" },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 2000,
    message: "JWT 토큰을 입력해주세요.",
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 3000,
    message: "JWT 토큰 검증 실패",
  },
  TOKEN_VERIFICATION_SUCCESS: {
    isSuccess: true,
    code: 1002,
    message: "JWT 토큰 검증 성공",
  }, // ?

  //Request error
  SIGNUP_USERID_EMPTY: {
    isSuccess: false,
    code: 2001,
    message: "아이디를 입력해주세요.",
  },
  SIGNUP_USERID_LENGTH: {
    isSuccess: false,
    code: 2002,
    message: "아이디는 5~20자 이내로 입력해주세요.",
  },
  SIGNUP_NICKNAME_EMPTY: {
    isSuccess: false,
    code: 2003,
    message: "닉네임을 입력해주세요.",
  },
  SIGNUP_NICKNAME_LENGTH: {
    isSuccess: false,
    code: 2004,
    message: "닉네임은 10자 이내로 입력해주세요.",
  },
  SIGNUP_EMAIL_EMPTY: {
    isSuccess: false,
    code: 2005,
    message: "이메일을 입력해주세요.",
  },
  SIGNUP_EMAIL_LENGTH: {
    isSuccess: false,
    code: 2006,
    message: "이메일은 30자 이내로 입력해주세요.",
  },
  SIGNUP_EMAIL_TYPE_ERROR: {
    isSuccess: false,
    code: 2007,
    message: "이메일의 형식이 잘못되었습니다.",
  },
  SIGNUP_PHONENUMBER_EMPTY: {
    isSuccess: false,
    code: 2008,
    message: "핸드폰 번호를 입력해주세요.",
  },
  SIGNUP_PHONENUMBER_LENGTH: {
    isSuccess: false,
    code: 2009,
    message: "핸드폰 번호는 11자 이내로 입력해주세요.",
  },
  SIGNUP_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 2010,
    message: "비밀번호를 입력해주세요.",
  },
  SIGNUP_USERNAME_EMPTY: {
    isSuccess: false,
    code: 2011,
    message: "이름을 입력해주세요.",
  },
  SIGNUP_BIRTH_EMPTY: {
    isSuccess: false,
    code: 2012,
    message: "생년월일을 입력해주세요.",
  },
  SIGNUP_SEX_EMPTY: {
    isSuccess: false,
    code: 2013,
    message: "성별을 입력해주세요.",
  },
  COMMENT_EMPTY: {
    isSuccess: false,
    code: 2014,
    message: "후기를 적어주세요.",
  },
  COMMENT_LENGTH: {
    isSuccess: false,
    code: 2015,
    message: "후기가 너무 짧습니다.",
  },
  SIGNAL_TIME_EMPTY: {
    isSuccess: false,
    code: 2016,
    message: "약속 시간을 정해주세요.",
  },
  SIGNAL_AREA_EMPTY: {
    isSuccess: false,
    code: 2017,
    message: "만날 장소를 입력해주세요.",
  },
  HASHTAG_CANT_EXCEED: {
    isSuccess: false,
    code: 2018,
    message: "키워드는 8개까지 입력할 수 있습니다.",
  },
  BLACK_ALREADY_EXIST: {
    isSuccess: false,
    code: 2019,
    message: "이미 블랙리스트에 있습니다.",
  },
  BADGE_IS_ALREADY_MAIN: {
    isSuccess: false,
    code: 2020,
    message: "해당 배지는 이미 대표 배지로 설정되어 있습니다.",
  },
  STATUS_IS_NOT_VALID: {
    isSuccess: false,
    code: 2021,
    message: "status가 올바르지 않습니다.",
  },
  CHATROOM_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2022,
    message: "존재하지 않는 채팅방입니다.",
  },
  NOT_IN_ROOM_MEMBER: {
    isSuccess: false,
    code: 2023,
    message: "해당 채팅방에 속해있는 유저가 아닙니다.",
  },
  MERCHANDISE_ALREADY_HIDE_ON: {
    isSuccess: false,
    code: 2024,
    message: "해당 상품은 이미 숨기기 상태입니다.",
  },
  MERCHANDISE_ALREADY_HIDE_OFF: {
    isSuccess: false,
    code: 2025,
    message: "해당 상품은 이미 숨기기 상태가 아닙니다.",
  },
  USER_IS_NOT_EXIST: {
    isSuccess: false,
    code: 2026,
    message: "해당 유저는 존재하지 않습니다.",
  },
  PAGE_IS_EMPTY: {
    isSuccess: false,
    code: 2027,
    message: "page를 입력해주세요.",
  },
  PAGE_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2028,
    message: "page 형식이 올바르지 않습니다.",
  },
  SIZE_IS_EMPTY: {
    isSuccess: false,
    code: 2029,
    message: "size를 입력해주세요.",
  },
  SIZE_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2030,
    message: "size 형식이 올바르지 않습니다.",
  },
  SELECT_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2031,
    message: "selectedId 형식이 올바르지 않습니다.",
  },
  MERCHANDISE_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2032,
    message: "merchandiseId 형식이 올바르지 않습니다.",
  },
  LOCATION_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2033,
    message: "locationId 형식이 올바르지 않습니다.",
  },
  CATEGORY_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2034,
    message: "categoryId 형식이 올바르지 않습니다.",
  },
  ROOM_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2035,
    message: "roomId 형식이 올바르지 않습니다.",
  },
  BADGE_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2036,
    message: "badgeId 형식이 올바르지 않습니다.",
  },
  AUTH_NUM_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2037,
    message: "인증번호 형식이 올바르지 않습니다.",
  },
  AUTHOR_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2038,
    message: "authorId 형식이 올바르지 않습니다.",
  },
  REVIEW_ID_FORM_IS_NOT_CORRECT: {
    isSuccess: false,
    code: 2039,
    message: "reviewId 형식이 올바르지 않습니다.",
  },
  LOGIN_PW_NOT_CORRECT: {
    isSuccess: false,
    code: 2040,
    message: "password가 일치하지 않습니다.",
  },
  LOCATION_IS_NOT_IN_ARZONE: {
    isSuccess: false,
    code: 2041,
    message: "sigPromiseArea가 ARzone의 location이 아닙니다.",
  },
  USER_USERIDX_EMPTY: {
    isSuccess: false,
    code: 2042,
    message: "userIdx를 입력해주세요.",
  },
  USER_USERIDX_LENGTH: {
    isSuccess: false,
    code: 2043,
    message: "userIdx는 0보다 큰 값으로 입력해주세요.",
  },
  USER_IMAGE_EMPTY: {
    isSuccess: false,
    code: 2044,
    message: "업로드 사진이 없습니다.",
  },

  // Response error
  SIGNUP_REDUNDANT_USERID: {
    isSuccess: false,
    code: 3001,
    message: "이미 존재하는 아이디입니다.",
  },
  SIGNUP_REDUNDANT_NICKNAME: {
    isSuccess: false,
    code: 3002,
    message: "이미 존재하는 닉네임입니다.",
  },
  SIGNUP_REDUNDANT_EMAIL: {
    isSuccess: false,
    code: 3003,
    message: "이미 존재하는 이메일입니다.",
  },
  SIGNUP_REDUNDANT_PHONENUMBER: {
    isSuccess: false,
    code: 3004,
    message: "이미 존재하는 번호입니다.",
  },
  SIGNUP_INVALID_USERID: {
    isSuccess: false,
    code: 3005,
    message: "존재하지 않는 아이디입니다.",
  },

  // 쪽지
  MSG_MATCHIDX_EMPTY: {
    isSuccess: false,
    code: 3006,
    message: "matchIdx 값이 들어오지 않았습니다.",
  },
  MSG_SENDERIDX_EMPTY: {
    isSuccess: false,
    code: 3007,
    message: "senderIdx 값이 들어오지 않았습니다.",
  },
  MSG_TEXT_EMPTY: {
    isSuccess: false,
    code: 3008,
    message: "텍스트를 입력해주세요.",
  },
  MSG_ROOMID_EMPTY: {
    isSuccess: false,
    code: 3009,
    message: "roomId 값이 들어오지 않았습니다.",
  },
  MSG_TEXT_OVER: {
    isSuccess: false,
    code: 3010,
    message: "한글 500자, 영어 1000자 미만으로 입력하세요.",
  },

  MODIFY_REDUNDANT_NICKNAME: {
    isSuccess: false,
    code: 3050,
    message: "이미 존재하는 닉네임입니다.",
  },

  SIGNALFIND_LONGITUDE_EMPTY: {
    isSuccess: false,
    code: 4000,
    message: "경도값이 존재하지 않습니다.",
  },

  SIGNALFIND_LATITUDE_EMPTY: {
    isSuccess: false,
    code: 4001,
    message: "위도값이 존재하지 않습니다.",
  },
  SIGNALFIND_USERIDX_EMPTY: {
    isSuccess: false,
    code: 4002,
    message: "유저 인덱스가 존재하지 않습니다.",
  },
  SIGNAL_APPLYIDX_EMPTY: {
    isSuccess: false,
    code: 4003,
    message: "매칭 상대 인덱스가 존재하지 않습니다.",
  },

  IF_AGATHA_DEFEAT_KOBBOONG: {
    isSuccess: false,
    code: 5252,
    message: "오이오이,, 이건 말이 안된다구,,",
  },

  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 4000, message: "데이터 베이스 에러" },
  SERVER_ERROR: { isSuccess: false, code: 4001, message: "서버 에러" },

  SMS_SEND_SUCCESS : {
    isSuccess: true,
    code: 5000,
    message: "SMS 전송 성공"
  },

  SMS_VERIFY_SUCCESS : {
    isSuccess: true,
    code: 5001,
    message: "SMS 검증 성공"
  },

  SMS_SEND_FAILURE : {
    isSuccess: false,
    code: 5002,
    message: "SMS 전송 실패"
  },

  FAILURE_SMS_AUTHENTICATION : {
    isSuccess: false,
    code: 5003,
    message: "SMS 권한 NO"
  },

  FCM_IS_EMPTY : {
    isSuccess: false,
    code: 5004,
    message: "FCM 빈 요청값"
  }
};


