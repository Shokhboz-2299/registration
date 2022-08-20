const sha256 = require('sha256')
const { sign, verify } = require('../utils/jwt.js')
const { isValidDate } = require('../utils/validation.js')

const LOGIN = (req, res) => {
	try {
		let { username, password } = req.body || {}

		username = username?.trim()
		password = password?.trim()

		if(!username) {
			throw new Error("username is required!")
		}

		if(!password) {
			throw new Error("password is required!")
		}

		const users = req.readFile('users') || []

		const user = users.find(user => user.username == username && user.password == sha256(password))

		if(user) {
			return res.status(200).json({
				status: 200,
				message: "The user successfully loggen in!",
				token: sign({ userId: user.userId })
			})
		}

		throw new Error("Wrong username or password!")

	} catch(error) {
		return res.status(400).json({
			status: 400,
			message: error.message,
			token: null
		})
	}
}

const REGISTER = (req, res) => {
	try {
		let { username, password, birthDate, gender } = req.body || {}

		username = username?.trim()
		password = password?.trim()
		birthDate = birthDate?.trim()
		gender = gender?.trim()

		if(
			!username ||
			username.length > 50 ||
			username.split(' ').length > 1
		) {
			throw new Error("invalid username!")
		}

		if(
			!password ||
			password.length <= 4
		) {
			throw new Error("invalid password!")
		}

		if(
			!birthDate ||
			!isValidDate(birthDate)
		) {
			throw new Error("invalid birthDate!")
		}

		if(
			!gender ||
			!['male', 'female'].includes(gender)
		) {
			throw new Error("invalid gender!")
		}

		const users = req.readFile('users') || []

		if(users.find(user => user.username == username)) {
			throw new Error("user already exists!")
		}

		const user = {
			userId: users.length ? users.at(-1).userId + 1 : 1,
			password: sha256(password),
			username, gender, birthDate
		}

		users.push(user)

		req.writeFile('users', users)

		return res.status(200).json({
			status: 200,
			message: "The user successfully registered!",
			token: sign({ userId: user.userId })
		})

	} catch(error) {
		return res.status(400).json({
			status: 400,
			message: error.message,
			token: null
		})
	}
}


module.exports = {
	REGISTER,
	LOGIN
}