import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'mydb.db', location: 'default' },
  () => { console.log('Database opened'); },
  error => { console.log('Error: ', error); }
);

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER);'
    );
  });
};

export const addUser = (name, age) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO users (name, age) VALUES (?, ?);', [name, age]);
  });
};

export const getUsers = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM users;', [], (tx, results) => {
      let users = [];
      for (let i = 0; i < results.rows.length; ++i) {
        users.push(results.rows.item(i));
      }
      callback(users);
    });
  });
};

