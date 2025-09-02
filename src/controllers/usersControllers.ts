import { query } from '../config/database.js'

interface UserRow {
    userName: string;
}

async function getAllUserNames(): Promise<string[]> {
    console.info('Getting all user names')
    
    try {
        const result = await query('SELECT "userName" FROM users')
        return convertToArray(result.rows)
    } catch (error) {
        console.error('Error fetching user names:', error)
        throw error
    }
}

async function checkUsername(username: string | undefined): Promise<boolean> {
    console.info('Checking username already in use')
    try {
        const result = await query('SELECT "userName" FROM users WHERE "userName" = $1', [username])
        return result.rows.length > 0
    } catch (error) {
        console.error('Error checking username:', error)
        throw error
    }
}

function convertToArray(resultObjs: UserRow[]): string[] {
    const userNames: string[] = resultObjs.map((u: UserRow) => u.userName)
    console.info("Returning: ", userNames)
    return userNames
}

export { getAllUserNames, checkUsername }

