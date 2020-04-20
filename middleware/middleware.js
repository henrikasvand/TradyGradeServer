const { verifyToken } = require("../auth/jwtService")

const authenticateToken = (req, res, next) => {
    /*
    This middleware checks the validity of the submitted jwt, then sets req.user to match the user found in the jwt.
    */
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // checks if there is an authHeader, then separates token portion from Bearer portion and returns only the token
    if (token == null) return res.sendStatus(401)

    user = verifyToken(token)
    if (user == null) return res.sendStatus(403)
    else req.user = user
    next()
}

module.exports = { authenticateToken }