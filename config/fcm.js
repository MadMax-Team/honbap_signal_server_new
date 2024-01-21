const https = require('https');
const { google } = require('googleapis');


const PROJECT_ID = "honbab-signal";
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    const key = require('./../config/fcm.json');
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}




//10001, 11001
function buildSignalMessage(token,title,body, code, [info]){
    return {
        "message": {
            "token": token,
            "notification": {
                "title": title,
                "body": body
            },
            "data": {
                "code": code,
                "message": info
            }
        }
    };
}

//10002
function buildIdxMessage(token, code, userIdx, nickName) {
    return {
        "message": {
            "token": token,
            "notification": {
                "title": "혼밥시그널",
                "body": "시그널 신청을 확인해주세요"
            },
            "data": {
                "code": code,
                "userIdx": userIdx,
                "nickName": nickName,
            }
        }
    };
}

function buildAlarmMessage(token,code){
    return {
        "message": {
            "token": token,
            "notification":{
            },
            "data": {
                "code": code,
            }
        }
    };
}


function sendFcmMessage(token, FCMMessage){

    getAccessToken().then(function(accessToken) {
        const options = {
        hostname: HOST,
        path: PATH,
        method: 'POST',
        // [START use_access_token]
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
        // [END use_access_token]
        };

        const request = https.request(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(data) {
            console.log('Message sent to Firebase for delivery, response:');
            console.log(data);
        });
        });

        request.on('error', function(err) {
        console.log('Unable to send message to Firebase');
        console.log(err);
        });

        request.write(JSON.stringify(FCMMessage));
        request.end();
    });
}

module.exports = { sendFcmMessage, buildSignalMessage, buildIdxMessage, buildAlarmMessage };
