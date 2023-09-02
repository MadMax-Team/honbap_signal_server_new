const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { logger } = require('../../../config/winston');
const crypto = require("crypto");
const regexEmail = require("regex-email");
// const { User } = require('../../../models');

//const secret_config = require('secret') // 이거 때문에 Enter text to encrypt 입력창 생성.
const jwt = require("../../../modules/jwt");
const KakaoStrategy = require("passport-kakao").Strategy;
const axios = require("axios");
const passport = require("passport");

const kakao = {
  clientID: "35ce5fcae9e7005b5e9f41c504eff834",
  clientSecret: "PwWQHM1dV1cdRLtyyGwmKlu3c3rrRTBv",
  redirectUri: "/auth/kakao/callback",
};

// Naver 번호 인증 //
const secret_key = require("../../../config/secret_sms");

const Cache = require("memory-cache");
const CryptoJS = require("crypto-js");
const { test } = require("regex-email");

const date = Date.now().toString();
const uri = secret_key.NCP_serviceID;
const secretKey = secret_key.NCP_secretKey;
const accessKey = secret_key.NCP_accessKey;
const method = "POST";
const space = " ";
const newLine = "\n";
const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
const url2 = `/sms/v2/services/${uri}/messages`;

const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

hmac.update(method);
hmac.update(space);
hmac.update(url2);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);

const hash = hmac.finalize();
const signature = hash.toString(CryptoJS.enc.Base64);



//controller : 판단 부분.
/**
 * API No. 1
 * API Name : 로그인 API (비회원일 경우 회원가입 후 로그인)
 * [POST] /user/login
 */

exports.signin = async function (req, res) {
  const { email, password } = req.body;

  const signInResponse = await userService.login(email, password);

  return res.send(signInResponse);
};

/**
 * API No. 2
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/user/signup
 */

exports.postUsers = async function (req, res) {
  const { email, password, userName, birth, phoneNum, sex } = req.body;
  // email checking and print error message

  // 빈 값 체크
  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
  // 길이 체크
  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
  // 형식 체크 (by 정규표현식)
  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_TYPE_ERROR));

  // userName

  // 빈 값 체크
  if (!userName) return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
  // 길이 체크
  if (userName.length > 10)
      //VARCHAR(10) 이 한글로는 5자로 제한되는지 확인 필요
    return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

  // phoneNum

  // 빈 값 체크
  if (!phoneNum)
    return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
  // 길이체크
  if (phoneNum.length > 11)
    return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH));

  // 빈 값 체크
  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2010
  if (!userName) return res.send(response(baseResponse.SIGNUP_USERNAME_EMPTY)); // 2011
  if (!birth) return res.send(response(baseResponse.SIGNUP_BIRTH_EMPTY)); // 2012
  if (!sex) return res.send(response(baseResponse.SIGNUP_SEX_EMPTY)); // 2013

  const signUpResponse = await userService.createUsers(
      // userId,
      email,
      password,
      userName,
      birth,
      phoneNum,
      sex
  );

  return res.send(response(signUpResponse));
};

/**
 * API No. 3
 * API Name : 유저 프로필 등록 API
 * [POST] /app/user/signup/plusInfo
 */

exports.postUserProfile = async function (req, res) {
  const {
    userIdx,
    profileImg,
    taste,
    hateFood,
    interest,
    avgSpeed,
    preferArea,
    mbti,
    userIntroduce,
  } = req.body;
  // userId checking and print error message

  const userProfileResponse = await userService.createUserProfile(
    userIdx,
    profileImg,
    taste,
    hateFood,
    interest,
    avgSpeed,
    preferArea,
    mbti,
    userIntroduce
  );

  return res.send(userProfileResponse);
};

/**
 * API No. 4
 * API Name : 유저 인덱스 조회 API
 * [GET] /app/user/signup/:userId
 */

exports.getUserIdx = async function (req, res) {
  const email = req.params.email;

  if (email == ":email") {
    return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
  }

  const userIdxResponse = await userProvider.getUserIdx(email);

  if (userIdxResponse.length <= 0)
    return res.send(errResponse(baseResponse.SIGNUP_INVALID_ID));

  return res.send(response(baseResponse.SUCCESS, userIdxResponse));
};

/**
 * API No. 5
 * API Name : 유저 개인정보 조회 API
 * [GET] /app/user/myinfo
 */
exports.getUserInfo = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  console.log(userIdxFromJWT)

  //validation
  if (!userIdxFromJWT) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));  //2042
  }
  if (userIdxFromJWT <= 0) {
    return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));  //2043
  }

  const userInfoResponse = await userProvider.getUserInfo(userIdxFromJWT);

  return res.send(response(baseResponse.SUCCESS, userInfoResponse));
};

/**
 * API No. 6
 * API Name : 유저 마이페이지(프로필) 조회 API
 * [GET] /app/user/mypage
 */
exports.getUserProfile = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;

  //validation
  if (!userIdxFromJWT) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));  //2042
  }
  if (userIdxFromJWT <= 0) {
    return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));  //2043
  }

  const userMypageResponse = await userProvider.getUserProfile(userIdxFromJWT);

  return res.send(response(baseResponse.SUCCESS, userMypageResponse));
};

/**
 * API No. 7
 * API Name : 유저 패스워드 수정 API
 * [PATCH] /app/user/myinfo/modifypw
 */
exports.patchUserPassword = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { password } = req.body;
  //validation
  if (!userIdxFromJWT) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));  //2042
  }
  if (userIdxFromJWT <= 0) {
    return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));  //2043
  }

  const updatePW = await userService.updatePassword(password, userIdxFromJWT);

  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 8
 * API Name : 유저 개인정보 수정 API
 * [PATCH] /app/user/myinfo
 */
exports.patchUserInfo = async function (req, res) {
  const userIdxFromJWT = req.verifiedToken.userIdx;
  const { userName, birth } = req.body;

  //validation
  if (!userIdxFromJWT) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));  //2042
  }
  if (userIdxFromJWT <= 0) {
    return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));  //2043
  }

  const updateUserInfo = await userService.updateUserInfo(
    userName,
    birth,
    userIdxFromJWT
  );
  return res.send(baseResponse.SUCCESS);
};

/**
 * API No. 9
 * API Name : 유저 프로필 수정 API
 * [PATCH] /app/user/mypage
 */
exports.patchUserProfile = async function (req, res) {
  const userIdxFromJwt = req.verifiedToken.userIdx;
  const {
    profileImg,
    taste,
    hateFood,
    interest,
    avgSpeed,
    preferArea,
    mbti,
    userIntroduce,
  } = req.body;

  //validation
  if (!userIdxFromJwt) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));  //2042
  }
  if (userIdxFromJwt <= 0) {
    return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));  //2043
  }

  const updateUserProfile = await userService.updateUserProfile(
    profileImg,
    taste,
    hateFood,
    interest,
    avgSpeed,
    preferArea,
    mbti,
    userIntroduce,
    userIdxFromJwt
  );

  return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 12
 * API Name : 유저 닉네임 중복 체크 API
 * [GET] /app/user/:nickName
 */
 exports.getUserNickName = async function (req, res) {
  const nickName = req.params.nickName;

  //validation
  if (!nickName) {
    return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));  //2003
  }

  const getUserNickNameResponse = await userProvider.nickNameCheck(nickName);

  if (getUserNickNameResponse.length > 0)
    return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME));

  // return res.send(response(baseResponse.SUCCESS));
 };

/**
 * API No. 13
 * API Name : jwt에서 userIdx 반환
 * [GET] /app/user/getIdx
 */
exports.getUserIdxFromJWT = async function (req, res) {
  const userIdxFromJwt = req.verifiedToken.userIdx;
  await userProvider.getUserIdxFromJWT();
  console.log(userIdxFromJwt);
  //validation
  if (!userIdxFromJwt) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));  //2042
  }
  if (userIdxFromJwt <= 0) {
    return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));  //2043
  }

  console.log("userIdx:", userIdxFromJwt);
  const userIdx = userIdxFromJwt;
  return res.send(response(baseResponse.SUCCESS, userIdx));
};

/**
 * API No. 14
 * API Name : 유저 이미지사진 수정
 * [patch] /user/myimage
 */
exports.patchUploadImage = async function(req,res){
  const userIdxFromJwt = req.verifiedToken.userIdx;
  const location = req.file.location;

  if (!userIdxFromJwt) {
    return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));  //2042
  }
  if (!location){
    return res.sen(errResponse(baseResponse.USER_IMAGE_EMPTY)); // 2044
  }
  const uploadResponse = await userService.uploadImage(userIdxFromJwt,location);

  return res.send(uploadResponse[0]);
}


/*
 * API Name : 카카오 로그인 API
 * [GET] /app/auth/kakao
 */

passport.use(
  "kakao",
  new KakaoStrategy(
    {
      clientID: kakao.clientID,
      clientSecret: kakao.clientSecret,
      callbackURL: kakao.redirectUri,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log("-------------------------------------------------------");
      // console.log(refreshToken);
      // console.log("-------------------------------------------------------");
      // console.log(profile);
      // // 받아오는 정보:
      // // profile = {
      // //   provider: 'kakao',
      // //   id: number,
      // //   username: string,
      // // }
      // console.log("-------------------------------------------------------");
      // console.log(done);
      try {
        // 카카오 계정이 데이터베이스에 있나 확인
        const kakaoIdResponse = await userProvider.getKakaoId(
          profile.provider,
          profile.id
        );
        // console.log(kakaoIdResponse);
        // { id: 2337290442 }
        if (Object.keys(kakaoIdResponse).length > 0) {
          // 로그인
          const signInResponse = await userService.kakaoLogin(
            profile._json.kakao_account.email
          );

          done(null, signInResponse);
        }
        // else {
        //   // 카카오 회원가입
        // }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

/*
 * API Name : 번호 인증 API
 * [POST] /app/send
 */

exports.send = async function (req, res) {
  const phoneNumber = req.body.phoneNumber;

  Cache.del(phoneNumber);

  //인증번호 생성
  const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

  console.log(verifyCode);

  Cache.put(phoneNumber, verifyCode.toString());

  axios({
    method: method,
    json: true,
    url: url,
    headers: {
      "Content-Type": "application/json",
      "x-ncp-iam-access-key": accessKey,
      "x-ncp-apigw-timestamp": date,
      "x-ncp-apigw-signature-v2": signature,
    },
    data: {
      type: "SMS",
      contentType: "COMM",
      countryCode: "82",
      from: "01023279226",
      content: `[honbap-signal] 인증번호 [${verifyCode}]를 입력해주세요.`,
      messages: [
        {
          to: `${phoneNumber}`,
        },
      ],
    },
  })
    .then(function (res) {
      res.send(response(baseResponse.SMS_SEND_SUCCESS));
    })
    .catch((err) => {
      if (err.res == undefined) {
        res.send(response(baseResponse.SMS_SEND_SUCCESS));
      } else res.sned(errResponse(baseResponse.SMS_SEND_FAILURE));
    });
};

/*
 * API Name : 번호 인증 API
 * [POST] /app/verify
 */

exports.verify = async function (req, res) {
  const phoneNumber = req.body.phoneNumber;
  const verifyCode = req.body.verifyCode;

  const CacheData = Cache.get(phoneNumber);

  if (!CacheData) {
    return res.send(errResponse(baseResponse.FAILURE_SMS_AUTHENTICATION));
  } else if (CacheData !== verifyCode) {
    return res.send(errResponse(baseResponse.FAILURE_SMS_AUTHENTICATION));
  } else {
    Cache.del(phoneNumber);
    return res.send(response(baseResponse.SMS_VERIFY_SUCCESS));
  }
};


