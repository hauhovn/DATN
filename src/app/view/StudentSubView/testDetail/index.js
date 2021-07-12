import React, {Component} from 'react';
import {Modal, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {Icon} from 'native-base';

//api
import {getCTBaiKiemTra} from '../../../../server/BaiKiemTra/getTestDetail';
//colors
import {settings} from '../../../config';

var mainColor = settings.colors.colorMain;
var colorThumblr = settings.colors.colorThumblr;

var root;
export class TestDetail extends Component {
  constructor(props) {
    super(props);
    root = this;
    this.state = {
      data: '',
      resData: '',
    };
  }
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }
  handleOnCloseDialog = () => {
    this.props.closeDialog();
    this.setState({modalVisible: false});
  };
  handleOnRequestClose = () => {
    this.props.closeDialog();
  };
  componentDidMount() {
    //root.getTestsDetail();
  }

  render() {
    const data = this.props.data || '';
    console.log('tao nhan duoc: ', data);
    //

    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={this.handleOnRequestClose}>
        <View style={styles.container}>
          <View style={styles.box}>
            <View style={styles.buttonBox}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.handleOnCloseDialog()}>
                <Icon
                  type="AntDesign"
                  name="closecircleo"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: -15,
                padding: 8,
              }}>
              <Text style={textStyles.title}>{data.clickedData.TenLopHP}</Text>
              <Text style={[textStyles.title, {fontSize: 13}]}>
                {data.clickedData.TenBaiKT}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                borderBottomWidth: 2,
                borderColor: mainColor,
                marginHorizontal: '20%',
              }}>
              <Text style={textStyles.date}>{data.clickedData.Ngay}</Text>
            </View>
            {/* <Text>root.state.data.TenGV</Text> */}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 217, 217,0.95)',
  },
  box: {
    height: 500,
    width: '80%',
    backgroundColor: '#faf9f7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: mainColor,
  },
  buttonBox: {
    marginTop: -13,
    marginEnd: -13,
    alignItems: 'flex-end',
  },
  button: {
    justifyContent: 'center',
    height: 38,
    width: 38,
    borderRadius: 20,
    backgroundColor: '#dbdbdb',
  },
  icon: {
    padding: 2,
    fontSize: 34,
    color: mainColor,
  },
});

const textStyles = StyleSheet.create({
  title: {
    color: colorThumblr,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 8,
  },
  subTitle: {
    color: colorThumblr,
    marginTop: -15,
  },
  date: {
    fontSize: 14,
    marginRight: '-25%',
    paddingBottom: 12,
  },
});
