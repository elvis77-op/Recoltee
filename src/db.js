import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'mydb.db', location: 'default' },
  () => { console.log('Database opened'); },
  error => { console.log('Error: ', error); }
);

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT);'
    );
  });
};
export const addNote = (title, content) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO notes (title, content) VALUES (?, ?);', [title, content]);
  });
};
export const getNotes = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM notes;', [], (tx, results) => {
      let notes = [];
      for (let i = 0; i < results.rows.length; ++i) {
        notes.push(results.rows.item(i));
      }
      callback(notes);
    });
  });
};

export const deleteNote = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM notes WHERE id = ?;',
      [id],
      (tx, results) => {
        console.log('Note deleted successfully');
        if (callback) callback();
      },
      error => {
        console.log('Delete note error: ', error);
        return false;
      }
    );
  });
};

export const closeDB = () => {
  db.close(
    () => { console.log('Database closed'); },
    error => { console.log('Database close error: ', error); }
  );
};

export default db;


