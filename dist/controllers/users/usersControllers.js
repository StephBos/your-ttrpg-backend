import { query } from '../../config/database.js';
import argon2 from 'argon2';
import { error } from 'console';
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
        const result = await query('SELECT "username" FROM users WHERE "username" = $1', [username?.trim().toLowerCase()]);
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
        return null;
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
async function verifyLogin(userNameOrEmail, password) {
    try {
        const isEmail = userNameOrEmail.includes('@');
        const usernameOrEmailQuery = isEmail
            ? "SELECT * FROM users WHERE email = $1"
            : "SELECT * FROM users WHERE username = $1";
        const result = await query(usernameOrEmailQuery, [userNameOrEmail]);
        if (result.rows.length === 0) {
            const dummyHash = "$argon2id$v=19$m=4096,t=3,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
            await argon2.verify(dummyHash, password);
            return { valid: false, message: 'Invalid username or password' };
        }
        console.log('result', result);
        return { valid: true, message: '' };
    }
    catch (e) {
        console.error("Login error:", e);
        throw error;
    }
}
function convertToArray(resultObjs) {
    const userNames = resultObjs.map((u) => u.userName);
    console.info("Returning: ", userNames);
    return userNames;
}
export { getAllUserNames, checkUsername, createUser, checkEmail, verifyLogin };
//# sourceMappingURL=usersControllers.js.map