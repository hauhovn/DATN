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
//
import {AppRouter} from '../../../../../../navigation/AppRouter';
import {settings} from '../../../../../../../app/config';
import {MyAppBar} from '../../app-bar';
//APIs
import {getTestStatus} from '../../../../../../../server/BaiKiemTra/get-status';
import {
  inittiateSocket,
  serverStartTest,
} from '../../../../../../../server/SocketIO';
import {check} from 'react-native-permissions';

export const EndTestScreen = ({route, navigation}) => {
  //Consts
  const data = route.params?.data;
  const [status, setStatus] = React.useState(0);

  React.useEffect(() => {
    loadOption();
  }, []);
  React.useEffect(() => {
    let _data = {
      id: data.MaSV,
      room: data.MaBaiKT,
      name: data.TenSV,
      is_teacher: false,
      socket_id: '',
    };
    if (status == 1) {
      inittiateSocket(data.MaBaiKT, _data, 'Đã vào phòng chờ', 1);
      serverStartTest((err, data) => {
        if (err) return;
        if (data != '') {
          console.log('hahahahahahaah');
          setStatus(2);
        }
      });
    }
    if (status == 2) {
      inittiateSocket(data.MaBaiKT, _data, 'Đã vào trễ', 2);
      serverStartTest((err, data) => {
        if (err) return;
        console.log(data);
      });
    }
  }, [status]);

  React.useEffect(() => {
    console.log('STATUS: ', status);
    if (status > 1) {
      navigation.navigate(AppRouter.TESTING, {data: data});
    }
  }, [status]);

  async function loadOption() {
    await checkTest(data.MaSV, data.MaBaiKT);
  }

  async function checkTest(MaSV, MaBaiKT) {
    let res = await getTestStatus(MaSV, MaBaiKT);
    setStatus(res.status);
  }
  // Socket request
  function requestJoinTest(MaSV, MaBaiKT, TenSV, Info, Status) {
    //socket.connect();
    let data = {
      id: MaSV,
      room: MaBaiKT,
      name: TenSV,
      is_teacher: false,
      socket_id: '',
    };
    // socket.emit('client-join-test', {
    //   data: data,
    //   info: Info,
    //   status: Status,
    // });
  }
  // SocketIO listen
  //   socket.on('server-start-test', function (res) {
  //     console.log(res);
  //     setStatus(2);
  //   });

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
      <Text style={styles.title}>BẠN ĐÃ KẾT THÚC BÀI KIỂM TRA</Text>
      <Text style={styles.textContent}>Ahihi.............</Text>
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
