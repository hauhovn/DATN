import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  SectionList,
} from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import {ItemJoinLeaveRoom} from './item';
import {getTestInfo} from '../../../server/TestInfo/get-test-info';

export const DemoView = () => {
  const socket = io('http://10.0.2.2:3000', {autoConnect: false});
  const [room, setRoom] = useState('22');
  const [reRender, setReRender] = useState(false);
  var render2 = 0;
  let flatList = React.useRef();

  const [data, setData] = useState([]);
  const [stop, setStop] = useState(false);

  //sockets on

  //get new status
  socket.on('server-send-newstatus', function (res) {
    console.log('# server-send-newstatus: ', res);
    // User connect
    let userA = data;
    userA.push(res);
    setData(userA);
    setReRender(render2++);
    flatList.current.scrollToEnd();
  });

  //Effect
  React.useEffect(() => {
    if (!stop) {
      getOldInfo(room);
      setStop(true);
    }
  }, []);
  //funcs
  async function getOldInfo(MaBKT) {
    setData([]);
    let res = await getTestInfo(MaBKT);
    //console.log(MaBKT + 'RES: ', JSON.stringify(res));
    setData(res.data);
  }

  function pressStart(isStart) {
    socket.connect();
    socket.emit('client-set-time', {room: room, isStart: isStart});
    console.log('client-set-time: ', isStart, '  input: ', room);
    if (isStart) {
      socket.emit('client-start-test', {room: room});
    }
  }

  function connectAndJoinRoom(isConnect) {
    socket.disconnect();
    if (isConnect) {
      socket.connect();
      joinRoom(room);
    }
  }

  function joinRoom(room) {
    let data = {
      id: 6969,
      room: room,
      name: 'Giảng cnb viên',
      is_teacher: true,
      socket_id: null,
    };
    socket.emit('client-join-test', {
      data: data,
      info: 'Day la giang vien',
      status: 1,
    });
    socket.connect();
    getOldInfo(room);
  }
  function leaveRoom(room) {
    socket.emit('client-leave-room', room);
  }

  function logRoom() {
    socket.emit('client-request-logroom');
  }
  const myRenderItem = ({item}) => (
    <View style={{flex: 1, flexDirection: 'row', margin: 3, padding: 2}}>
      <Text>{item.name}</Text>
      <Text>{item.status}</Text>
    </View>
  );
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
          <TouchableOpacity
            onPress={() => logRoom()}
            style={([styles.button], {backgroundColor: 'purple'})}>
            <Text style={styles.texts}>Log Rooms</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatList}
        style={styles.flatList}
        data={data}
        extraData={reRender}
        keyExtractor={item => item.socketid + item.status}
        renderItem={({item}) => <ItemJoinLeaveRoom item={item} />}
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
    backgroundColor: '#d9d9d9',
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
