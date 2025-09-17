declare function getAllUserNames(): Promise<string[]>;
declare function checkUsername(username: string | undefined): Promise<boolean>;
declare function createUser(username: string, email: string, password: string): Promise<any>;
export { getAllUserNames, checkUsername, createUser };
//# sourceMappingURL=usersControllers.d.ts.map