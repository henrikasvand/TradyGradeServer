/*
  • API URL: /api/auth
  • ADD JWT SECRET TO .env FILE TO HAVE AUTHENTICATION WORK PROPERLY
  •
*/
const express = require('express');
const router = express.Router();
const hashService = require("../auth/hashService")
const jwtService = require("../auth/jwtService")
const bcrypt = require("bcryptjs")
const { authenticateToken } = require("../middleware/middleware")
const { getUserByName } = require("../dao/usersDao")
const { saveRefreshToken, retrieveRefreshTokenFromDatabase, deleteRefreshToken } = require("../dao/jwtDao")

router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const user = await getUserByName(req.user.name)
    res.json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { name, password } = req.body

    if (!name || !password) res.status(400).json({ error: "Please fill out the required fields." })

    const foundUser = await getUserByName(name)

    if (foundUser == null) {
      res.status(400).json({ error: "Invalid credentials" })
      return
    }
    
    const passwordIsCorrect = await hashService.dataCompare(password, foundUser.password)

    // in case authentication succeeds, we generate and return a jwt access token + refresh token. 
    if (passwordIsCorrect) {
      const token = jwtService.generateToken(foundUser)
      const refreshToken = jwtService.refreshToken(foundUser)
      saveRefreshToken(foundUser.id, refreshToken) // <- move to db
      res.status(200).json({ ...foundUser, token: token, refreshToken: refreshToken })
    } else {
      res.status(400).json({ error: "Invalid credentials" })
    }
  } catch (err) {
    res.status(500).send()
    next(err)
  }
})

router.delete("/logout", (req, res, next) => {
  //remove refresh token from db on logout
  deleteRefreshToken(req.body.name)
  res.status(204).json({ error: "Logout successful" })
})

router.post("/token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken == null) {
      res.status(401).send()
      return
    }

    //retrieve user name by decoding refresh token, then generate new refresh token
    const newToken = jwtService.verifyRefreshTokenAndReturnNewToken(refreshToken)
    const tokenUser = jwtService.verifyToken(newToken)
    if (newToken == null) res.status(403).json({ error: "Permission denied" })

    //retrieve refresh token from db and make sure response isn't empty
    const storedRefreshToken = await retrieveRefreshTokenFromDatabase(tokenUser.name)
    if (storedRefreshToken == null) res.status(401).send()

    //check that submitted refresh token matches with db stored one
    const refreshTokenIsValid = hashService.dataCompare(refreshToken, storedRefreshToken)
    if (!refreshTokenIsValid) res.status(403).json({ error: "Permission denied" })

    let user = await getUserByName(tokenUser.name)
    user = { ...user, token: newToken, refreshToken: refreshToken }

    //all good, return token to user
    if (newToken) res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }

})

module.exports = router;
