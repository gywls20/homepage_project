var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index',{title:"express"});
// });



//DB연결
const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'0000',
    port:3306,
    database:'homepage'
});

connection.connect( function(err){
    if(err) throw err;
    console.log("DB연결성공!")
});


//숙박업소 상세보기
router.get('/room/details', function(req, res, next) {
  let room_id = req.query.room_id;
  let item = '지역, 숙박업소명, 카테고리, 주소, 좌표x, 좌표y, 전화번호, 홈페이지Url, 객실정보, 상세내용'
  connection.query(`SELECT ${item} FROM homepage.room where room_id=? `, [room_id], (err, rows) => {
      if(err) throw err;
      else {
          //callback(rows);
          res.render('roomdetails', {rows: rows});
      }
  });
});

//관광명소 상세보기
router.get('/tour/details', function(req, res, next) {
  let tour_id = req.query.tour_id;
  let item = '지역, 이름, 카테고리, 여행태그, 주소, 좌표x, 좌표y, 전화번호, 홈페이지Url, 서브타이틀 ,기타,상세내용'
  connection.query(`SELECT ${item} FROM homepage.tour where tour_id=? `, [tour_id], (err, rows) => {
      if(err) throw err;
      else {
          //callback(rows);
          res.render('tourdetails', {rows: rows});
      }
  });
});
//추천음식점 상세보기
router.get('/food/details', function(req, res, next) {
  let food_id = req.query.food_id;
  let item = '지역, 업종, 상호명, 주메뉴, 주소, 연락처, 소개'
  connection.query(`SELECT ${item} FROM homepage.food where 번호=? `, [food_id], (err, rows) => {
      if(err) throw err;
      else {
          //callback(rows);
          res.render('fooddetails', {rows: rows});
      }
  });
});
//메인페이지
router.get('/', function(req, res, next) {
  res.render('index');
});

//숙박업소 페이지
router.get('/room', async(req, res)=> {
  let count = Number(req.query.count) || 1;

  let item = 'room_id, 지역, 숙박업소명, 카테고리'
  let startIndex = (count - 1) * 10;
  connection.query(`SELECT ${item} FROM homepage.room LIMIT ?, 10 `, [startIndex], (err, rows) => {
      if(err) throw err;
      else {
          //callback(rows);
          res.render('room', {rows: rows,count: count});
      }
  });

  
});
//관광명소 페이지
router.get('/tour', function(req, res, next) {
  let count = Number(req.query.count) || 1;

  let item = 'tour_id, 지역, 이름, 카테고리'
  let startIndex = (count - 1) * 10;
  connection.query(`SELECT ${item} FROM homepage.tour LIMIT ?, 10 `, [startIndex], (err, rows) => {
      if(err) throw err;
      else {
          res.render('tour', {rows: rows,count: count});
      }
  });
});
//추천음식점 페이지
router.get('/food', function(req, res, next) {
  let count = Number(req.query.count) || 1;

  let item = '번호, 지역, 상호명, 업종'
  let startIndex = (count - 1) * 10;
  connection.query(`SELECT ${item} FROM homepage.food LIMIT ?, 10 `, [startIndex], (err, rows) => {
      if(err) throw err;
      else {
          res.render('food', {rows: rows,count: count});
      }
  });
});
//모범음식점 페이지
router.get('/safe', function(req, res, next) {
  let count = Number(req.query.count) || 1;

  let item = '번호, 지역, 업소명, 주메뉴, 주소, 전화번호'
  let startIndex = (count - 1) * 10;
  connection.query(`SELECT ${item} FROM homepage.safefood LIMIT ?, 10 `, [startIndex], (err, rows) => {
      if(err) throw err;
      else {
          res.render('safe', {rows: rows,count: count});
      }
  });
});
//충남소개 페이지
router.get('/chungnam', function(req, res, next) {
  res.render('chungnam');
});
//참고사이트페이지
router.get('/info', function(req, res, next) {
  res.render('info');
});

//게시판 보기 페이지
router.get('/review', function(req, res, next) {
  let item = 'review_id, 제목, 내용, 태그, 작성자'
  connection.query(`SELECT ${item} FROM homepage.review`, (err, rows) => {
      if(err) throw err;
      else {
          res.render('review', {rows: rows});
      }
  });
});
//게시글쓰기 페이지
router.get('/write', function(req, res, next) {
  res.render('write');
});
//게시글 쓰기완료 버튼
router.post('/write/ok', function(req, res, next) {
  let title = req.body.title;
  let writer = req.body.writer;
  let message = req.body.message;
  let tag = req.body.tag;

  connection.query(`INSERT INTO homepage.review (제목, 내용, 작성자, 태그 ) VALUES (?, ?, ?, ?)`, [title,message,writer,tag], (err, rows) => {
    if(err) throw err;
    else {
        res.send('<script>alert("작성완료하였습니다.");</script>');
        res.render('write');
    }
  });
});


module.exports = router;