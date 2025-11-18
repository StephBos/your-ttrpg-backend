import { query } from '../../config/database.js'
import argon2 from 'argon2'
import type { User, UserRow, LoginResponse, ResetPasswordResponse } from './users.js'
import crypto from 'crypto'

async function getAllUserNames(): Promise<string[]> {
    console.info('Getting all user names')
    
    try {
        const result = await query('SELECT "username" FROM users')
        console.log('Fetched user names:', result.rows)
        return convertToArray(result.rows)
    } catch (error) {
        console.error('Error fetching user names:', error)
        throw error
    }
}

async function getUserByUsername(username: string): Promise<User> {
    console.info('Getting username: ', username)
    
    try {
        const result = await query('SELECT * FROM users where username = $1', [username])
        return result.rows[0]
    } catch (error) {
        console.error('Error fetching user names:', error)
        throw error
    }
}

async function checkUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    console.info('Checking username already in use')
    try {
        const isEmail = usernameOrEmail.includes('@')
        const usernameOrEmailQuery = isEmail
            ? "SELECT id, created_at, username, password, email FROM users WHERE email = $1"
            : "SELECT id, created_at, username, password, email FROM users WHERE username = $1"
        const result = await query(usernameOrEmailQuery,[usernameOrEmail])
        return result.rows[0]
    } catch (error) {
        console.error('Error checking username:', error)
        throw error
    }
}

async function createUser(username: string, email: string, password: string): Promise<User | null>{
    console.info('Creating user with username: ', username, ' and email ', email)
    const emailInUse = await checkUsernameOrEmail(email)
    if(emailInUse){
        console.error('Email is already in use')
        return null
    }
    const hashedPw = await argon2.hash(password)

    try {
        const result = await query('INSERT into users (username, email, password) ' +
                    'VALUES ($1, $2, $3) ' +
                    'returning username, email, created_at',
                    [username, email, hashedPw]
        )
        return result.rows[0]
    } catch(error) {
        console.error('Error creating user:', username, ' error: ', error)
        throw error
    }
}

async function checkEmail(email: string): Promise<boolean>{
    console.info('Checking if email is already in use')
    try{
        const emailsInUse = await query('SELECT users.email from users where email = $1', [email])
        return emailsInUse.rows.length > 0
    } catch (error){
        console.error('Error checking email: ', email, 'Error: ', error )
        throw error
    }
}

async function verifyLogin(usernameOrEmail: string, password: string): Promise<LoginResponse>{
    console.log('usernameOrEmail', usernameOrEmail, 'password', password)
    try{
        const result = await checkUsernameOrEmail(usernameOrEmail)

        if(!result){
            const dummyHash = "$argon2id$v=19$m=4096,t=3,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; 
            await argon2.verify(dummyHash, password)
            return {valid: false, message: 'Invalid username or password'}
        }

        const correctPassword = await argon2.verify(result.password, password)
        if(!correctPassword){
            return {valid: false, message: 'Invalid username or password'}
        }

        return {valid: true, username: result.username}
    } catch(error){
        console.error("Login error:", error)
        throw error
    }
}

async function resetPasswordRequest(userNameOrEmail: string): Promise<ResetPasswordResponse>{
    console.info('Checking if username or email exists for password reset:', userNameOrEmail)
    try{
        const user = await checkUsernameOrEmail(userNameOrEmail)
        if(user){
            const { token, tokenHash } = makeResetToken()
            
            await query(
                'UPDATE password_resets SET token_hash = $1 WHERE id = $3',
                [tokenHash, user.id]
            )
            
            sendResetEmail(user.email, token)
        }
        return {success: true, message: 'If the username or email exists, a reset link has been sent'}
    } catch(error){
        console.error("Error in resetPasswordRequest:", error)
        throw error
    }
}
    

function convertToArray(resultObjs: UserRow[]): string[] {
    const userNames: string[] = resultObjs.map((u: UserRow) => u.username)
    console.info("Returning: ", userNames)
    return userNames
}


function makeResetToken() {
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    return { token, tokenHash }
}

function sendResetEmail(email: string, token: string) {
    const resetLink = `https://your-ttrpg.com/reset-password?token=${token}`
    console.info(`Sending password reset email to ${email} with link: ${resetLink}`)
    // Here you would integrate with an email service to send the actual email
}

export { getAllUserNames, checkUsernameOrEmail, createUser, checkEmail, verifyLogin, resetPasswordRequest, getUserByUsername }
