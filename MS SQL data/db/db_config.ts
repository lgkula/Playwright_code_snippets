const config = {
  user: "KRUK\\lkula",
  password: "zaQ!@34567890",
};
const config1 = {
  user: "sql_app_enforcement_test",
  password: "X6KPA2D4xM84gOtP3Pnz",
};

export const db_config = `Driver={SQL Server};
                          Server={BASIA};
                          Database={Delfin};
                          User Id=${config1.user};
                          Password=${config1.password};
                          Trusted_Connection=Yes;
                          TrustServerCertificate=True;`;
