const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/keys');
const passport = require('passport');

const User = require('../../models/User');

// $router POST api/users/register
// @desc 返回请求的json数据
// @access public
router.post('/register', (req, res) => {
	// 查询一条记录
	User.findOne({
		email: req.body.email
	}).then(user => {
		if (user) {
			return res.status(400).json('邮箱已被注册');
		} else {
			var avatar = gravatar.url('req.body.email', { s: '200', r: 'pg', d: 'mm' });
			const newUser = new User({
				avatar,
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				identity: req.body.identity
			});

			// 用bcrypt对密码进行加密
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) {
						throw err;
					}
					// hash为加密后的密码
					newUser.password = hash;
					// 调用存储方法
					newUser
						.save()
						.then(user => {
							res.json(user);
						})
						.catch(err => {
							console.log(err);
						});
				});
			});
		}
	});
});

// $router POST api/users/login
// @desc 返回token jwt password
// @access public
router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email }).then(user => {
		if (!user) {
			return res.status(404).json('用户不存在');
		}
		// 密码匹配
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// 规则，加密名字，过期时间，回调
				const rule = {
					id: user.id,
					name: user.name,
					avatar: user.avatar,
					identity: user.identity
				};
				// 登录成功后返回token，相当于一个令牌，只有令牌校验成功，才可以获取想要的数据
				jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
					if (err) {
						throw err;
					}
					res.json({
						success: true,
						// 必须加Bearer
						token: 'Bearer ' + token
					});
				});
				// res.json({ msg: 'success' });
			} else {
				return res.status(404).json('密码错误');
			}
		});
	});
});

// $router GET api/users/current
// @desc 返回current user
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email,
		identity: req.user.identity
	});
});

module.exports = router;
