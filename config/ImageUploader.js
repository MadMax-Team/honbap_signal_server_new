const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')
// import AWS from 'aws-sdk'
// import multer from 'multer'
// import multerS3 from 'multer-s3'
// import path from 'path'

const s3 = new AWS.S3({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAcceessKey : process.env.AWS_SECRET_ACCESS_KEY
});

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줘야 실제 월을 얻을 수 있습니다.
const day = currentDate.getDate();


const imageUploader = multer({
    storage : multerS3({
        s3:s3,
        bucket:'honbap',
        key : function(req, file, cb) {
            var ext = file.mimetype.split('/')[1];
            if(!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext)) {
                return cb(new Error('Only images are allowed'));
            }
            cb(null, Date.now() + '_' + file.originalname);
        }
    }),
    acl : 'public-read-write',
    // limits: { fileSize: 5 * 1024 * 1024 },
});


module.exports = imageUploader;