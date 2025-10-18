interface UserRow {
    username: string;
}

interface User {
    id: number
    username: string
    email: string
    created_at: string
    password: string
}

interface LoginResponse {
    valid: boolean
    message?: string
    username?: string
}

interface ResetPasswordResponse {
    success: boolean
    message?: string
}

export{UserRow, User, LoginResponse, ResetPasswordResponse}