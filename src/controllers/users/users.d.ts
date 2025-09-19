interface UserRow {
    userName: string;
}

interface User {
    username: string
    email: string
    created_at: string
}

interface LoginResponse {
    valid: boolean
    message: string
    username?: string
}

export{UserRow, User, LoginResponse}