import type { User, LoginResponse, ResetPasswordResponse } from './users.js';
declare function getAllUserNames(): Promise<string[]>;
declare function checkUsernameOrEmail(usernameOrEmail: string): Promise<User>;
declare function createUser(username: string, email: string, password: string): Promise<User | null>;
declare function checkEmail(email: string): Promise<boolean>;
declare function verifyLogin(usernameOrEmail: string, password: string): Promise<LoginResponse>;
declare function resetPasswordRequest(userNameOrEmail: string): Promise<ResetPasswordResponse>;
export { getAllUserNames, checkUsernameOrEmail, createUser, checkEmail, verifyLogin, resetPasswordRequest };
//# sourceMappingURL=usersControllers.d.ts.map