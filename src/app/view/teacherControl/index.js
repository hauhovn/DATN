import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  AppState,
} from 'react-native';

import {useNavigation, useIsFocused, useRoute} from '@react-navigation/native';

import {Header} from '../../components/header';
import io from 'socket.io-client/dist/socket.io.js';
import {ItemJoinLeaveRoom} from './join-leave-room-item';
import {getTestInfo} from '../../../server/TestInfo/get-test-info';

export const TeacherControl = () => {
  const nav = useNavigation();
  const route = useRoute();
  const user = route.params?.user;
  const BaiKiemTra = route.params?.BaiKiemTra;
  // Refs

  let flatList = React.useRef();
  const appState = React.useRef(AppState.currentState);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [usersStatusList, setUsersStatusList] = useState([]);
  const [reRender, setReRender] = useState(false);

  const [stopRender, setStopRender] = useState(false);
  // Socket
  const socket = io('http://10.0.2.2:3000', {autoConnect: true});

  // Socket ONs

  // Join room affter connect
  socket.on('connect', function () {
    console.log('connected . . .');
    joinRoom(BaiKiemTra.MaBaiKT, user.MaGV, user.TenGV);
  });

  // get new status
  socket.on('server-send-newstatus', function (res) {
    console.log('# server-send-newstatus: ', res);
    // User connect
    let userA = data;
    userA.push(res);
    setUsersStatusList(userA);
    setUsersStatusList(render2++);
    flatList.current.scrollToEnd();
  });

  socket.on('server-accept-logout', function (data) {
    console.log(data);
    socket.disconnect();
  });
  // Check out app
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      socket.connect();
      // requestJoinTest(data.MaSV, data.MaBaiKT, data.TenSV, 'Đã kết nối lại', 3);
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
    if (appState.current === 'background') {
      // Connect to server
      // socket.emit('client-get-userquanlity', 'ouut');
      if (!socket.connected) socket.connect();
    }
  };
  //Effect
  useEffect(() => {
    loadOption();
  }, []);

  //funcs
  async function loadOption() {
    let _user = user[0];
    await joinRoom(BaiKiemTra.MaBaiKT, _user.MaGV, _user.TenGV);
    await getOldInfo(BaiKiemTra.MaBaiKT);
  }

  async function getOldInfo(MaBKT) {
    setUsersStatusList([]);
    let res = await getTestInfo(MaBKT);
    //console.log(MaBKT + 'RES: ', JSON.stringify(res));
    setUsersStatusList(res.data);
  }

  function pressStart(isStart) {
    // socket.connect();
    // socket.emit('client-set-time', {room: room, isStart: isStart});
    // console.log('client-set-time: ', isStart, '  input: ', room);
    // if (isStart) {
    //   socket.emit('client-start-test', {room: room});
    // }
  }

  function joinRoom(room, userID, userName) {
    if (!socket.connected) socket.connect();
    let data = {
      id: userID,
      room: room,
      name: userName,
      is_teacher: true,
      socket_id: null,
    };
    socket.emit('client-request-join', {
      data: data,
      info: 'Day la giang vien',
      status: 1,
    });
    // socket.connect();
    // getOldInfo(room);
  }

  function _disconnect() {
    //socket.disconnect();
    console.log('client-request-logout');
    socket.emit('client-request-logout', {code: 202, info: 'logout_me'});
  }

  const _leftHandle = () => {
    if (socket.connected) {
      socket.disconnect();
    }
    nav.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <Header
        user={user}
        leftHandle={() => {
          _leftHandle();
        }}
      />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => _disconnect()}
          style={([styles.button], {backgroundColor: 'orange'})}>
          <Text style={styles.texts}>Disconnect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // Log rooms
            if (socket.connected) {
              console.log('log rooms');
              socket.emit('client-request-logroom');
            }
          }}
          style={([styles.button], {backgroundColor: 'purple'})}>
          <Text style={styles.texts}>Log Rooms</Text>
        </TouchableOpacity>
        <FlatList
          ref={flatList}
          style={styles.flatList}
          data={usersStatusList}
          extraData={reRender}
          keyExtractor={item =>
            item.socketid + (Math.random() * 1000).toString()
          }
          renderItem={({item}) => <ItemJoinLeaveRoom item={item} />}
        />
      </View>
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
