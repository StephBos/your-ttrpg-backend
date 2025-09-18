import { query } from '../config/database.js';
import argon2 from 'argon2';
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
        const result = await query('SELECT "username" FROM users WHERE "username" = $1', [username?.toLowerCase()]);
        console.log('result', result.rows.length);
        return result.rows.length > 0;
    }
    catch (error) {
        console.error('Error checking username:', error);
        throw error;
    }
}
async function createUser(username, email, password) {
    console.info('Creating user with username: ', username, ' and email ', email);
    const emailInUse = await checkEmail(email);
    if (emailInUse) {
        console.error('Email is already in use');
        return 'Email already in use';
    }
    const hashedPw = await argon2.hash(password);
    try {
        const result = await query('INSERT into users (username, email, password) ' +
            'VALUES ($1, $2, $3) ' +
            'returning username, email, created_at', [username, email, hashedPw]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error creating user:', username, ' error: ', error);
        throw error;
    }
}
async function checkEmail(email) {
    console.info('Checking if email is already in use');
    try {
        const emailsInUse = await query('SELECT users.email from users where email = $1', [email]);
        return emailsInUse.rows.length > 0;
    }
    catch (error) {
        console.error('Error checking email: ', email, 'Error: ', error);
        throw error;
    }
}
function convertToArray(resultObjs) {
    const userNames = resultObjs.map((u) => u.userName);
    console.info("Returning: ", userNames);
    return userNames;
}
export { getAllUserNames, checkUsername, createUser };
//# sourceMappingURL=usersControllers.js.map