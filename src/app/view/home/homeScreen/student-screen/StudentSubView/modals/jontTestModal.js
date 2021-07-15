import React from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  View,
  StyleSheet,
} from 'react-native';

export const JontTestModal = ({MaSV, MaBaiKT}) => {
  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={true}
      style={styles.container}></Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(151, 153, 156,0.45)',
  },
});
