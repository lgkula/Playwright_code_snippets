import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ConnectionPool } from 'mssql';
import { connectToDelfinDatabase } from './connectToDelfinDatabase';
import { GetMassPaymentsFeeResponse } from '../types/GetMassPaymentsFeeResponse';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Warsaw');

interface QueryDelTbOplata {
    opl_ID: number;
    opl_IDSprawa: number;
    opl_DataWniesienia: string;
    opl_Kwota: number;
    opl_Tytul: string;
    opl_IDTytulOplaty: number;
    opl_DataWprowadzenia: string;
    opl_IDPracownik: number;
    opl_PaymentID: number | null;
}

export const queryResultFromDelTbOplataTableDelfinDatabase = async (
    caseIds: number[],
    employeeId: number,
    testStartDate: Dayjs,
): Promise<GetMassPaymentsFeeResponse[]> => {
    // ): QueryDelTbOplata[] => {
    const sqlQuery: string = `SELECT [opl_ID], [opl_IDSprawa], [opl_DataWniesienia], [opl_Kwota], [opl_Tytul], [opl_IDTytulOplaty], [opl_DataWprowadzenia], [opl_IDPracownik], [opl_PaymentID] FROM [Delfin].[dbo].[DEL_TB_Oplata] WHERE [opl_IDPracownik] = ${employeeId} AND [opl_IDSprawa] IN (${caseIds})`;
    let connection: ConnectionPool = {} as ConnectionPool;
    try {
        connection = await connectToDelfinDatabase();
        const resultFromSqlQuery = await connection.request().query(sqlQuery);

        const filteredResultFromSqlQuery: QueryDelTbOplata[] =
            resultFromSqlQuery.recordset.filter((payment: QueryDelTbOplata) =>
                dayjs.tz(payment.opl_DataWniesienia).isAfter(testStartDate),
            );

        const mappedFilteredResultFromSqlQuery: GetMassPaymentsFeeResponse[] =
            filteredResultFromSqlQuery.map((payment: QueryDelTbOplata) => ({
                id: payment.opl_ID,
                caseId: payment.opl_IDSprawa,
                paymentAt: new Date(payment.opl_DataWniesienia)
                    .toISOString()
                    .slice(0, -5),
                amount: payment.opl_Kwota,
                paymentTitle: payment.opl_Tytul,
                paymentTitleId: payment.opl_IDTytulOplaty,
                createdAt: new Date(payment.opl_DataWprowadzenia)
                    .toISOString()
                    .slice(0, -1),
                employeeId: payment.opl_IDPracownik,
                paymentId: Number(payment.opl_PaymentID),
            }));

        return mappedFilteredResultFromSqlQuery;
    } catch (error) {
        throw new Error(
            'Error connecting to the database or executing the query: ' + error,
        );
    } finally {
        if (connection) {
            await connection.close;
        }
    }
};
