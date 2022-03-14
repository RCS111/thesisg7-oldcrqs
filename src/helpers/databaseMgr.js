const mongoose = require('mongoose')

class DBManager {
    static config() {
        //db connections
        mongoose.connect(process.env.CONNECTION_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        const connection = mongoose.connection;
      
        //database events
        connection.once('open', () => {
          console.log('Connected to DB...')
        });
      
        return connection;
    }
}

module.exports = DBManager;