import { ConnectionPool } from 'mssql';
import { pwLogger } from './pwLogger';

const db_config = `Driver={SQL Server};
                          Server={${process.env.SERVER_DB}};
                          Database={Delfin};
                          User Id=${process.env.USER_DB};
                          Password=${process.env.PASSWORD_DB};
                          Trusted_Connection=Yes;
                          TrustServerCertificate=True;`;

export const connectToDelfinDatabase = async (): Promise<ConnectionPool> => {
    const connection = new ConnectionPool(db_config);
    await connection.connect();

    pwLogger('Connected to the database', 'info', 'all');
    return connection;
};
