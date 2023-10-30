import * as sql from 'mssql';
const sqlConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  options: {
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
};

export async function createDatabaseIfNotExists() {
  sql
    .connect(sqlConfig)
    .then(async (c) => {
      const arrayObjectDatabase = await c
        .request()
        .query('SELECT name FROM master.sys.databases');
      const arrayDB = arrayObjectDatabase.recordset.map((db) => db.name);
      if (arrayDB.includes(`${process.env.DB_NAME}`)) {
        console.log('Database already exists');
      } else {
        await c.request().query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log('Created database successfully');
      }
    })
    .catch(() => {
      // console.log('Error');
      // console.error(e);
    });
}
