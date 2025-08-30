interface Config {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
    };
}
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map