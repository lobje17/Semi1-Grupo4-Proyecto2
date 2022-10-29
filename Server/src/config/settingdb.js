const oracledb = require('oracledb');

cns = {
    user: "lobje",
    password: "201314059",
    connectString: "localhost/ORCL18"
}

async function Open(sql, binds, autoCommit) {
    let cnn = await oracledb.getConnection(cns);
    let result = await cnn.execute(sql, binds, { autoCommit });
    cnn.release();
    return result;
}

exports.Open = Open;