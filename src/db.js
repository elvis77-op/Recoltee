import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'mydb.db', location: 'default' },
  () => { console.log('✅ Database opened'); },
  error => { console.log('❌ Database error: ', error); }
);

// 初始化数据库，创建 notes 表
export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT
      );`
    );
  });
};

export const editNote = (id, title, content, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE notes SET title = ?, content = ? WHERE id = ?;',[title, content, id],
      () => {
        console.log('✅ Note edited');
        callback(true);    // 通知调用者成功
      },
      error => {
        console.log('❌ Edit note error:', error);
        callback(false);
      }
    );
  });
}

// 添加笔记
export const addNote = (title, content, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO notes (title, content) VALUES (?, ?);',
      [title, content],
      () => {
        console.log('✅ Note added');
        callback(true);    // 通知调用者成功
      },
      error => {
        console.log('❌ Add note error:', error);
        callback(false);
      }
    );
  });
};

// 获取所有笔记
export const getNotes = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM notes;',
      [],
      (txObj, results) => {
        let data = [];
        for (let i = 0; i < results.rows.length; i++) {
          data.push(results.rows.item(i));
        }
        callback(data);   // 把查询结果传给回调
      },
      error => {
        console.log('❌ Get notes error:', error);
      }
    );
  });
};

// 删除笔记
export const deleteNote = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM notes WHERE id = ?;',
      [id],
      () => {
        console.log('🗑️ Note deleted');
        callback(true);
      },
      error => {
        console.log('❌ Delete note error:', error);
        callback(false);
      }
    );
  });
};
