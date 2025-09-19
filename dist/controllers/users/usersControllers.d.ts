import type { User, LoginResponse } from './users.js';
declare function getAllUserNames(): Promise<string[]>;
declare function checkUsername(username: string | undefined): Promise<boolean>;
declare function createUser(username: string, email: string, password: string): Promise<User | null>;
declare function checkEmail(email: string): Promise<boolean>;
declare function verifyLogin(userNameOrEmail: string, password: string): Promise<LoginResponse>;
export { getAllUserNames, checkUsername, createUser, checkEmail, verifyLogin };
//# sourceMappingURL=usersControllers.d.ts.map