import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
//* USING MYSQL2 MODULE
import mysql from 'mysql2';

//* create the connection to database
// ! SQL LOCAL HOST
const mysqlConnection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'tiendamascota',
});

// ! CONNECTION TO PLANET SCALE DB HOST
// env variables declared on Railway host
// const mysqlConnection = mysql.createConnection({

//     database: process.env.DATABASE_PLANETSCALE_DATABASE,
//     user: process.env.DATABASE_PLANETSCALE_USERNAME,
//     host: process.env.DATABASE_PLANETSCALE_HOST,
//     password: process.env.DATABASE_PLANETSCALE_PASSWORD,
//     ssl : {
//         rejectUnauthorized : false
//     }
// });

mysqlConnection.connect((err) => {
  if (err) {
    console.log({ status: 'error', log: err });
    return;
  }
  // console.log('Connected to PlanetScale DB as ' + mysqlConnection.threadId)
  console.log('Connected to MySQL DB as ' + mysqlConnection.threadId);
});

export { mysqlConnection };
