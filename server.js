const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
// 接口api
const users = require('./routers/api/users');
const profiles = require('./routers/api/profiles');

const app = express();

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 使用中间件使用users,访问/api/users时获取到users
app.use('/api/users', users);
app.use('/api/profiles', profiles);

// 链接数据库
const db = require('./config/keys').mongoURL;
mongoose
	.connect(
		db,
		{ useNewUrlParser: true }
	)
	.then(() => {
		console.log('connect');
	})
	.catch(err => {
		console.log(err);
	});

	// 初始化passport
// passport的配置
app.use(passport.initialize());
require('./config/passport')(passport);

// 访问时给页面发送数据
// app.get('/', (req, res) => {
// 	res.send('hello world');
// });

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log('server start');
});
