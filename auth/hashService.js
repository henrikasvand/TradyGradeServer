const bcrypt = require("bcryptjs")

const hash = async data => {
    const salt = await bcrypt.genSalt()
    const hashedData = await bcrypt.hash(data, salt)
    return hashedData
}

const dataCompare = async (data, hashedData) => {
    try {
        let result = bcrypt.compare(data, hashedData)
        if (result) return result 
    } catch (error) {
        return error        
    }

}

module.exports = { hash, dataCompare }