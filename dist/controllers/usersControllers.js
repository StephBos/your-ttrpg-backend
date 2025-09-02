import { query } from '../config/database.js';
async function getAllUserNames() {
    console.info('Getting all user names');
    try {
        const result = await query('SELECT "userName" FROM users');
        return convertToArray(result.rows);
    }
    catch (error) {
        console.error('Error fetching user names:', error);
        throw error;
    }
}
async function checkUsername(username) {
    console.info('Checking username already in use');
    try {
        const result = await query('SELECT "userName" FROM users WHERE "userName" = $1', [username]);
        return result.rows.length > 0;
    }
    catch (error) {
        console.error('Error checking username:', error);
        throw error;
    }
}
function convertToArray(resultObjs) {
    const userNames = resultObjs.map((u) => u.userName);
    console.info("Returning: ", userNames);
    return userNames;
}
export { getAllUserNames, checkUsername };
//# sourceMappingURL=usersControllers.js.map