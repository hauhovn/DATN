import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  AppState,
  Image,
  Alert,
} from 'react-native';
import {useNavigation, useIsFocused, useRoute} from '@react-navigation/native';

// Items
import {Header} from '../../components/header';
import {ItemJoinLeaveRoom} from './join-leave-room-item';

// Socket IO
import {
  inittiateSocket,
  requestServerLogs,
  disconnectSocket,
  reconectSocketAuto,
  listenStudentInOut,
  requestStartTest,
} from '../../../server/SocketIO';

// APIs
import {updateTestStatus} from '../../../server/BaiKiemTra/update-status';
import {getTestInfo} from '../../../server/TestInfo/get-test-info';
import {getInfoBeforeTest} from '../../../server/TestInfo/get-info-before-test';

export const TeacherControl = () => {
  const nav = useNavigation();
  const route = useRoute();
  //   const user = route.params?.user;
  //   const BaiKiemTra = route.params?.BaiKiemTra;
  var user = [
    {
      DiaChi: 'Nguyễn Thị Thập',
      GIoiTinh: '0',
      MaGV: '1',
      Mail: 'chau@gmail.com',
      Password: '111111',
      SDT: '0775712017',
      TenGV: 'Nguyễn Phúc Bảo Châu',
      TrangThai: '1',
      isAdmin: '1',
    },
  ];
  let _user = user[0];
  var BaiKiemTra = {
    KeyBaiKT: '1',
    MaBaiKT: '22',
    Ngay: '2021-07-01',
    TenBaiKT: 'MCV_1',
    TenGV: 'Nguyễn Phúc Bảo Châu',
    TenLopHP: 'Một con vịt',
    ThoiGianLam: '01:51:00',
    TrangThai: '2',
  };
  // Refs

  let flatList = React.useRef();
  const appState = React.useRef(AppState.currentState);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [usersStatusList, setUsersStatusList] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //Effect
  useEffect(() => {
    pressConnect();
    reconectSocketAuto((err, data) => {
      if (err) return;
      console.log(data);
    });
    listenStudentInOut((err, data) => {
      if (err) return;
      console.log(data);
      setUsersStatusList(usersStatusList.concat(data));
    });
    loadOption();
  }, []);

  //funcs
  async function loadOption() {
    await getOldInfo(BaiKiemTra.MaBaiKT);
    setIsLoading(false);
  }

  async function getOldInfo(MaBKT) {
    setUsersStatusList([]);
    let res = await getTestInfo(MaBKT, 1);
    //console.log(MaBKT + 'RES: ', JSON.stringify(res));
    setUsersStatusList(res.data);
  }
  async function getOldInfoBefore(MaBKT) {
    setUsersStatusList([]);
    let res = await getInfoBeforeTest(MaBKT);
    //console.log(MaBKT + 'RES: ', JSON.stringify(res));
    setUsersStatusList(res.data);
  }

  function pressConnect() {
    console.log('con');
    let data = {
      id: _user.MaGV,
      room: BaiKiemTra.MaBaiKT,
      name: _user.TenGV,
      is_teacher: true,
      socket_id: null,
    };
    inittiateSocket(BaiKiemTra.MaBaiKT, data);
  }

  // Press students list
  function pressStudentsList() {
    requestServerLogs();
  }

  // Back button
  const _leftHandle = () => {
    disconnectSocket();
    nav.goBack();
  };
  function startTest(isStart) {
    Alert.alert(
      'Bạn có chắc',
      (isStart ? 'Bắt đầu' : 'Hủy bỏ') + ' bài kiểm tra này?',
      [
        {
          text: 'Đồng ý',
          onPress: () => {
            if (isStart) {
              requestStartTest(_user.MaGV, BaiKiemTra.MaBaiKT);
            } else {
            }
          },
        },
        {
          text: 'Bỏ qua',
        },
      ],
    );
  }

  return (
    <View style={{flex: 1}}>
      <Header
        user={user}
        leftHandle={() => {
          _leftHandle();
        }}
      />
      <View style={{flex: 1}}>
        <View style={actionBar.container}>
          <View style={actionBar.row}>
            <Text style={[actionBar.text, {color: '#000', marginLeft: 15}]}>
              Thí sinh đã vào: 30/69
            </Text>
            <TouchableOpacity
              onPress={() => startTest(true)}
              style={[
                actionBar.button,
                actionBar.shortButton,
                {backgroundColor: '#02ad02'},
              ]}>
              <Text style={actionBar.text}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
          <View style={actionBar.row}>
            <TouchableOpacity
              onPress={() => pressStudentsList()}
              style={[actionBar.button, actionBar.longButton]}>
              <Text style={[actionBar.text]}>Danh Sách Thí Sinh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startTest(false)}
              style={[
                actionBar.button,
                actionBar.shortButton,
                {backgroundColor: 'red'},
              ]}>
              <Text style={[actionBar.text]}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ebebeb',
          }}>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          <View>
            <Text style={{width: 170, textAlign: 'center', fontWeight: 'bold'}}>
              LỊCH SỬ TRUY CẬP
            </Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
        {isLoading ? (
          <View
            style={{
              width: '100%',
              height: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ebebeb',
            }}>
            <Image
              source={require('../../../app/asset/gif/load321.gif')}
              style={{height: 120, width: 120, marginTop: -250}}
            />
          </View>
        ) : usersStatusList?.length > 0 ? (
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
        ) : (
          <View
            style={{
              width: '100%',
              height: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ebebeb',
            }}>
            <Text style={{fontSize: 14, marginTop: -250}}>
              Chưa có thí sinh tham gia
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ebebeb',
  },
  buttons: {
    flexDirection: 'column',
  },
  actionBar: {},
  listActionsTitle: {},
  flatList: {
    flex: 1,
    backgroundColor: '#ebebeb',
    paddingTop: 15,
  },
  buttonBox: {
    width: 120,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  button: {
    width: 60,
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
const actionBar = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 12,
    borderColor: '#888',
    backgroundColor: '#ebebeb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  text: {fontSize: 15, color: '#fff'},
  button: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 19,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortButton: {
    width: 100,
  },
  longButton: {
    width: 170,
  },
});
