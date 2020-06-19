const db = require('./models');

class EasyDMCore{
    constructor(sqliteLocation){
        this.sqliteLocation = sqliteLocation;
        this.db = db(sqliteLocation);
    }

    async setProperty(property, value){
        // console.log(this.db)
        return await this.db.StateVariables.create({property,value})
    }
}

module.exports = EasyDMCore;