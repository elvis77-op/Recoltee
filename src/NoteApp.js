import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { initDB, addNote, getNotes, editNote, deleteNote } from './db';
import { BlurView } from '@react-native-community/blur';
import { SwipeableItem } from './swipeableItem';

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    initDB();
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    getNotes(data => {
      setNotes(data);
    });
  };

  const handleAdd = () => {
    if (!title || !content) return;
    addNote(title, content, success => {
      if (success) {
        setTitle('');
        setContent('');
        setVisible(false); 
        fetchNotes();
      }
    });
  };
  const handleEdit = () => {
    if (!title || !content) return;
    editNote(editingNote.id, title, content, success => {
      if (success) {
        setTitle('');
        setContent('');
        setEditingNote(null);
        setVisible(false); 
        fetchNotes();
      }
    });
  }

  const handleDelete = id => {
    deleteNote(id, success => {
      if (success) {
        fetchNotes();
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* 弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <BlurView style={StyleSheet.absoluteFill} blurType="light" blurAmount={10} />
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>📝 New note</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              style={[styles.input, { height: 80 }]}
              multiline
            />

            {/* 按钮区域并排 */}
            <View style={styles.buttonRow}>
              
              {editingNote ? (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#007bff' }]} onPress={handleEdit}>
                  <Text style={styles.actionBtnText}>Save changes</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#007bff' }]} onPress={handleAdd}>
                  <Text style={styles.actionBtnText}>Add</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#999' }]} onPress={() => {setVisible(false), fetchNotes()}}>
                <Text style={styles.actionBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 悬浮加号按钮 */}
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📒 Note list</Text>
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SwipeableItem
            onDelete={() => handleDelete(item.id)}
            onEdit={() => {
              setEditingNote(item);          
              setTitle(item.title);   
              setContent(item.content);   
              setVisible(true);  
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
            </View>
          </SwipeableItem>
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  deleteBtn: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 10,
  },
  fabText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 30,
  },
});
