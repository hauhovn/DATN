import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
//moduns
import io from 'socket.io-client/dist/socket.io.js';
//
import {AppRouter} from '../../../../../../navigation/AppRouter';
import {settings} from '../../../../../../../app/config';
import {MyAppBar} from '../../app-bar';
//APIs
import {getTestStatus} from '../../../../../../../server/BaiKiemTra/get-status';

export const WaitingScreen = ({route, navigation}) => {
  // Socket IO
  const socket = io(settings.NodeJsServer, {autoConnect: false});
  //Consts
  const data = route.params?.data;
  const [status, setStatus] = React.useState(0);
  let [stop, setStop] = React.useState(false);

  React.useEffect(() => {
    checkTest(data.MaSV, data.MaBaiKT);
  }, [data]);
  React.useEffect(() => {
    if (status == 1 && !stop) {
      requestJoinTest(
        data.MaSV,
        data.MaBaiKT,
        data.TenSV,
        'Đã vào phòng chờ',
        1,
      );
      setStop(true);
    }
    if (status == 2 && !stop) {
      requestJoinTest(data.MaSV, data.MaBaiKT, data.TenSV, 'Đã vào trễ', 2);
      setStop(true);
    }
  }, [status]);

  React.useEffect(() => {
    console.log('STATUS: ', status);
    if (status > 1) {
      navigation.navigate(AppRouter.TESTING, {data: data});
    }
  }, [status]);

  async function checkTest(MaSV, MaBaiKT) {
    let res = await getTestStatus(MaSV, MaBaiKT);
    setStatus(res.status);
  }
  // Socket request
  function requestJoinTest(MaSV, MaBaiKT, TenSV, Info, Status) {
    socket.connect();
    let data = {
      id: MaSV,
      room: MaBaiKT,
      name: TenSV,
      is_teacher: false,
      socket_id: '',
    };
    socket.emit('client-join-test', {
      data: data,
      info: Info,
      status: Status,
    });
  }
  // SocketIO listen
  socket.on('server-start-test', function (res) {
    console.log(res);
    setStatus(2);
  });

  return (
    <SafeAreaView style={styles.container}>
      <MyAppBar
        title=""
        leftHandle={() => navigation.goBack()}
        rightHandle={() => navigation.navigate(AppRouter.TESTING, {data: data})}
      />
      <Image
        style={styles.gif}
        source={require('../../../../../../asset/gif/are-you-there.gif')}
      />
      <View
        style={{
          borderRadius: 60,
          width: 106,
          height: 106,
          marginTop: -150,
          marginRight: -0.8,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
          borderColor: settings.colors.colorGreen,
        }}
      />
      <Text style={styles.title}>CHƯA BẮT ĐẦU</Text>
      <Text style={styles.textContent}>Bài kiểm tra này chưa bắt đầu!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'center',
  },

  gif: {
    resizeMode: 'cover',
    width: 120,
    height: 120,
    margin: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: settings.colors.colorMain,
  },
  textContent: {
    marginTop: 2,
  },
});
