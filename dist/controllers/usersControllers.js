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
function convertToArray(resultObjs) {
    const userNames = resultObjs.map((u) => u.userName);
    console.info("Returning: ", userNames);
    return userNames;
}
export { getAllUserNames };
//# sourceMappingURL=usersControllers.js.map