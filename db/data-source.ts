import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],  // or import every entity you create manually
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  logging: false,
  synchronize: false // set as true is you're' not carrying out migrations, but that isn't how things are typically done
}

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();
export default dataSource;