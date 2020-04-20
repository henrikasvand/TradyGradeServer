const pool = require('./poolConnection');
const hashService = require("../auth/hashService")
const { verifyRefreshToken } = require("../auth/jwtService")

exports.saveRefreshToken = async (id, refreshToken) => {
    try {
      const hashedRefreshToken = await hashService.hash(refreshToken)
      const response = await pool.query("UPDATE users SET refresh_token=$1 WHERE user_id=$2", [hashedRefreshToken, id])
      return response.rows
    } catch (err) {
      console.error(err.message)
      return null
    }
  }

  
exports.deleteRefreshToken = async (name) => {
    try {
        const response = await pool.query("UPDATE users SET refresh_token=NULL WHERE user_name=$1", [name])
        return response.rows
    } catch (err) {
        console.error(err.message)
        return null
    }
}

exports.retrieveRefreshTokenFromDatabase = async (name) => {
    try {
        const response = await pool.query("SELECT refresh_token FROM users WHERE user_name=$1", [name])
        if (!response.rows) return null
        const storedRefreshToken = response.rows[0].refresh_token
        return storedRefreshToken
    } catch (err) {
        console.error(err.message)
        return null
    }
}