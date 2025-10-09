import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Edit3, Trash2 } from 'lucide-react-native';

export const SwipeableItem = ({ children, onEdit, onDelete }) => {
  const translateX = useSharedValue(0);
  const MAX_SWIPE = -120;
  const SWIPE_THRESHOLD = MAX_SWIPE / 2;

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, MAX_SWIPE);
      } else {
        translateX.value = 0;
      }
    })
    .onEnd(() => {
      const target =
        translateX.value < SWIPE_THRESHOLD ? MAX_SWIPE : 0;

      translateX.value = withSpring(target, {
        damping: 14,    
        stiffness: 180,   
        mass: 0.8,         
        overshootClamping: false, 
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={onEdit}>
          <Edit3 color="white" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
          <Trash2 color="white" size={20} />
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.noteItem, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editBtn: {
    backgroundColor: '#007bff',
  },
  deleteBtn: {
    backgroundColor: '#ff4d4f',
  },
});
