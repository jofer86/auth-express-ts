import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'jorge',
    password: 'joferifi',
    database: 'initialDB',
    entities: [],
    synchronize: true,
    logging: false
});