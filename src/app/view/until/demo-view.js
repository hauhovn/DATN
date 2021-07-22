import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';

export const DemoView = () => {
  const socket = io('http://10.0.2.2:3000', {autoConnect: false});
  const [room, setRoom] = useState('');

  function pressStart(isStart) {
    socket.connect();

    socket.emit('client-set-time', {room: room, isStart: isStart});
    console.log('client-set-time: ', isStart, '  input: ', room);
  }
  React.useEffect(() => {
    joinRoom(room);
  }, []);
  function joinRoom(room) {
    socket.emit('client-join-test', {
      MaSV: 6969,
      MaBaiKT: room,
      TenSV: 'TenSV_DM',
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TextInput
          style={styles.input}
          onChangeText={setRoom}
          value={room}
          placeholder="useless placeholder"
        />
        <View style={styles.buttonBox}>
          <TouchableOpacity
            onPress={() => pressStart(true)}
            style={([styles.button], {backgroundColor: '#127'})}>
            <Text style={styles.texts}>Start</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            onPress={() => pressStart(false)}
            style={([styles.button], {backgroundColor: '#F24'})}>
            <Text style={styles.texts}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList style={styles.flatList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 10,
  },
  buttons: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    backgroundColor: '#987',
  },
  buttonBox: {
    height: '25%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 150,
    width: 264,
    padding: 15,
    borderRadius: 5,
  },
  texts: {
    padding: 20,
    fontSize: 24,
    color: '#fff',
  },
  input: {
    padding: 5,
    width: '50%',
    color: '#fff',
    backgroundColor: '#537067',
  },
});
