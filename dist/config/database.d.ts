import { Pool } from 'pg';
declare const pool: Pool;
declare function testConnection(): Promise<boolean>;
declare function query(text: string, params?: any[]): Promise<import("pg").QueryResult<any>>;
declare function getClient(): Promise<import("pg").PoolClient>;
export { query, getClient, testConnection, pool, };
//# sourceMappingURL=database.d.ts.map