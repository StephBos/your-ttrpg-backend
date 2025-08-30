const { query } = require('../config/database')

async function getAllUserNames() {
    console.info('Getting all user names')
    
    try {
        const result = await query('SELECT "userName" FROM users')
        return convertToArray(result.rows)
    } catch (error) {
        console.error('Error fetching user names:', error)
        throw error
    }
}

function convertToArray(resultObjs: any){
    const userNames: string[] = resultObjs.map((u: any) => u.userName)
    return userNames
}

module.exports = {
    getAllUserNames
}
