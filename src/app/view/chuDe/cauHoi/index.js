import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import {settings} from '../../../config';
import {Icon} from 'native-base';
import {RenderItem} from './renderItem';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppRouter} from '../../../navigation/AppRouter';
import {useIsFocused} from '@react-navigation/native';
import {getCH} from '../../../../server/MonHoc/getCH';
import {deleteCH} from '../../../../server/MonHoc/deleteCH';
import {Header} from '../../../components/header';
import {updateCD} from '../../../../server/ChuDe/updateCD';

export const CauHoi = ({params}) => {
  const nav = useNavigation();
  const focus = useIsFocused();
  const route = useRoute();
  const MaCD = route.params.item.MaCD;
  const MonHoc = route.params.monHoc;
  const user = route.params.user;

  const [data, setData] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [showModal, setModal] = useState(false);
  const [tenCD, setTenCD] = useState('');
  const [loading, setLoading] = useState(false);

  // Kéo xuống để reload
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData(MaCD);
    wait(500).then(() => setRefreshing(false));
  }, []);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  // Vừa focus vào là gọi refesh để lấy data
  useEffect(() => {
    if (focus) {
      onRefresh(MaCD);
    }
  }, [focus]);

  // Gọi api lấy danh sách câu hỏi theo mã môn học
  const getData = async data => {
    try {
      const res = await getCH(data);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Xóa câu hỏi bằng mã câu hỏi
  const del = async data => {
    try {
      const res = await deleteCH(data);
      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  // Nhấn vô item để nhảy qua trang thông tin
  const handlePressItem = item => {
    nav.navigate(AppRouter.INFO, {
      item: item,
      user: route.params.user,
      MonHoc: MonHoc,
      ChuDe: route.params.item,
    });
  };

  // Nhấn nút delete
  const deleteQuest = item => {
    del(item.MaCH);
  };

  // update
  const update = async () => {
    setLoading(true);
    try {
      const res = await updateCD(route.params.item.MaCD, tenCD);

      console.log('update: ', res);

      setLoading(false);
      setModal(false);
    } catch (error) {
      //
    }
  };

  // Render screen
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="dark-content" hidden={true} />
      <Header user={user} />
      <View
        style={{
          borderBottomWidth: 0.5,
          borderColor: '#CFD8DC',
          backgroundColor: '#fff',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View style={{flex: 1}}>
          <Text
            style={{
              marginLeft: '3%',
              color: settings.colors.colorThumblr,
              fontWeight: 'bold',
              marginBottom: 5,
              fontSize: 16,
              marginTop: 10,
            }}>
            CHỦ ĐỀ: {route.params.item.TenCD}
          </Text>
          <Text
            style={{
              marginLeft: '3%',
              color: settings.colors.colorThumblr,
              fontWeight: 'bold',
              marginBottom: 10,
              fontSize: 14,
            }}>
            MÔN HỌC: {MonHoc.TenMonHoc}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModal(true);
            setTenCD(route.params.item.TenCD);
          }}
          activeOpacity={0.5}
          style={{
            width: 35,
            height: 35,
            backgroundColor: settings.colors.colorMain,
            marginRight: '3%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}>
          <Icon
            type="MaterialCommunityIcons"
            name="playlist-edit"
            style={{fontSize: 26, color: '#fff'}}
          />
        </TouchableOpacity>
      </View>

      {data !== '' ? (
        <>
          {data !== undefined && data.length !== 0 ? (
            <View style={{backgroundColor: '#fff', flex: 1}}>
              <FlatList
                data={data}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <RenderItem
                    item={item}
                    data={data}
                    handle={handlePressItem}
                    handleDelete={deleteQuest}
                  />
                )}
                keyExtractor={item => item.MaCH}
                style={{flex: 1, paddingTop: 10, backgroundColor: '#fff'}}
              />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#fff',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 14, color: 'red'}}>Không có câu hỏi</Text>
            </View>
          )}
          <View
            style={{
              width: '100%',
              height: 50,
              marginTop: -65,
              alignItems: 'flex-end',
              paddingRight: 15,
              marginBottom: 15,
            }}>
            <TouchableOpacity
              onPress={() => {
                nav.navigate(AppRouter.AddExercise, {
                  item: route.params,
                  user: route.params.user,
                  MonHoc: MonHoc,
                });
              }}
              activeOpacity={0.5}
              style={{
                width: 55,
                height: 55,
                borderRadius: 500,
                backgroundColor: settings.colors.colorMain,
                borderWidth: 0.5,
                borderColor: settings.colors.colorBoderDark,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                type="Entypo"
                name="plus"
                style={{fontSize: 24, color: '#fff', marginBottom: -2}}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../../../asset/gif/load321.gif')}
            resizeMode="contain"
            style={{width: 100, height: 100}}
          />
        </View>
      )}

      <Modal
        // -------------------
        // -------------------------- SHOW MODAL
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setModal(false);
        }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor="rgba(0,0,0,1)"
          hidden={false}
          animated={true}
        />
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <Text
            onPress={() => {
              setModal(false);
            }}
            style={{flex: 1}}
          />
          <View
            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <Text
              onPress={() => {
                setModal(false);
              }}
              style={{flex: 1}}
            />
            <View
              style={{
                width: '90%',
                backgroundColor: '#fff',
                height: 195,
                borderRadius: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  width: '100%',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: settings.colors.colorGreen,
                    fontSize: 16,
                    fontWeight: 'bold',
                    flex: 1,
                  }}>
                  SỬA CHỦ ĐỀ
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModal(false);
                  }}
                  style={{
                    height: '100%',
                    paddingLeft: 20,
                  }}>
                  <Icon
                    type="AntDesign"
                    name="close"
                    style={{
                      fontSize: 24,
                      color: settings.colors.colorGreen,
                      marginBottom: -2,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: settings.colors.colorGreen,
                  marginLeft: 10,
                }}>
                Tên chủ đề
              </Text>
              <View
                style={{
                  height: 50,
                  marginTop: 5,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: settings.colors.colorBoderDark,
                  borderRadius: 12,
                }}>
                <TextInput
                  placeholder="Tên chủ đề"
                  placeholderTextColor="#8a817c"
                  value={tenCD}
                  onChangeText={t => {
                    setTenCD(t);
                  }}
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginVertical: 2,
                    color: '#000',
                  }}
                />
              </View>

              <View style={{height: 5}} />

              <TouchableOpacity
                onPress={() => {
                  update();
                }}
                activeOpacity={0.5}
                style={{
                  height: 50,
                  backgroundColor: loading
                    ? settings.colors.colorThumblr
                    : settings.colors.colorGreen,
                  marginHorizontal: 10,
                  marginVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#ffF', fontSize: 14, fontWeight: 'bold'}}>
                  LƯU THAY ĐỔI
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              onPress={() => {
                setModal(false);
              }}
              style={{flex: 1}}
            />
          </View>
          <Text
            onPress={() => {
              setModal(false);
            }}
            style={{flex: 1}}
          />
        </View>
      </Modal>
    </View>
  );
};
