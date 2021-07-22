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
  const [data, setData] = useState(undefined);

  let temp = [
    {name: 'Trao Trao', status: 'Disconnect'},
    {name: 'Meo Meo', status: 'Disconnect'},
    {name: 'Gau Gau', status: 'Connect'},
  ];
  //sockets on

  //get new status
  socket.on('server-send-newstatus', function (res) {
    console.log('# server-send-newstatus');
    if (res.isConnect) {
      // User connect
      setData(data.push({name: res.name, status: res.status}));
      console.log('# Has new connect');
    } else {
      // User disconnect
      let diser = data.find(name => name == res.name);
      setData(data.splice(data.indexOf(diser), 1));
      console.log('# Has new disconnect');
    }
  });

  //funcs

  function pressStart(isStart) {
    socket.emit('client-set-time', {room: room, isStart: isStart});
    console.log('client-set-time: ', isStart, '  input: ', room);
  }

  function connectAndJoinRoom(isConnect) {
    if (isConnect) {
      socket.connect();
      joinRoom(room);
    } else {
      socket.disconnect();
    }
  }

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
            onPress={() => connectAndJoinRoom(true)}
            style={([styles.button], {backgroundColor: 'blue'})}>
            <Text style={styles.texts}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => connectAndJoinRoom(false)}
            style={([styles.button], {backgroundColor: 'orange'})}>
            <Text style={styles.texts}>Disconnect</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            onPress={() => pressStart(true)}
            style={([styles.button], {backgroundColor: 'green'})}>
            <Text style={styles.texts}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => pressStart(false)}
            style={([styles.button], {backgroundColor: 'red'})}>
            <Text style={styles.texts}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.flatList}
        data={data}
        renderItem={({item}) => (
          <View>
            <Text>
              {item?.name} {item?.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    padding: 15,
    borderRadius: 5,
  },
  texts: {
    padding: 10,
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
