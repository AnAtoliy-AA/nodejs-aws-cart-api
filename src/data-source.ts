
import { config } from 'dotenv';
import { CartEntity } from './entities/Cart';
import { CartItemEntity } from './entities/CartItem';
import { DataSourceOptions, DataSource } from 'typeorm';
import { OrderEntity } from './entities/Order';
import { ProductEntity } from './entities/Product';
import { UserEntity } from './entities/User';

config();

//TODO: !!if you don't connect to postgres DB check process.env. variables in .env file and in dataSourceOptions

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  entities: [
    CartEntity,
    CartItemEntity,
    OrderEntity,
    ProductEntity,
    UserEntity,
  ],
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // synchronize: true,
  // migrations: ['./migrations/*.ts'],
  logging: true,

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
};

const AppDataSource = new DataSource(dataSourceOptions);

// AppDataSource.initialize()
//     .then(() => {
//         // Do something with the connection
//         console.log("Data Source has been initialized!");
//     })
//     .catch((error) => console.log("Error during Data Source initialization:", error));

export default AppDataSource;