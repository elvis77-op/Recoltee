import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { initDB, addNote, getNotes, deleteNote } from './db';  // ← 根据你的路径调整

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 初始化数据库 & 读取笔记
  useEffect(() => {
    initDB();
    fetchNotes();
  }, []);

  // 从数据库读取所有笔记
  const fetchNotes = () => {
    getNotes(data => {
      setNotes(data);
    });
  };

  // 添加笔记
  const handleAdd = () => {
    if (!title || !content) return;
    addNote(title, content, (success) => {
      if (success) {
        setTitle('');
        setContent('');
        fetchNotes(); // 重新刷新列表
      }
    });
  };

  // 删除笔记
  const handleDelete = (id) => {
    deleteNote(id, (success) => {
      if (success) {
        fetchNotes();
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📒 笔记列表</Text>

      {/* 输入框 */}
      <TextInput
        placeholder="标题"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="内容"
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <Button title="添加笔记" onPress={handleAdd} />

      {/* 笔记列表 */}
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
            </View>
            <Button title="删除" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default NoteApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#555',
  },
});
