import React, {useState} from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
//moduns
import io from 'socket.io-client/dist/socket.io.js';
import CountDown from 'react-native-countdown-component';
//
import {settings} from '../../config';

export const TestingTimeCountDown = () => {
  const socket = io('https://da-tot-nghiep.herokuapp.com', {jsonp: false});
  const [isRunning, setIsRunning] = useState(true);

  let render = 0;

  if (render === 0) {
    console.log('CHAUHHHH');
    socket.on('server-stop-time', function (data) {
      console.log('server-stop-time ', data);
      data !== isRunning ? setIsRunning(data) : console.log('cac');
    });
    render = 0;
  }

  render++;

  // const getTimeStatus = () => {
  //   console.log('Cai Gi Do :',isRunning);
  //   return isRunning;
  // }
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <CountDown
        size={16}
        until={3600}
        running={isRunning}
        onFinish={() => {}}
        digitStyle={{
          backgroundColor: '#FFF',
          borderWidth: 0,
          borderColor: 'blue',
        }}
        digitTxtStyle={{color: settings.colors.colorMain}}
        timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
        separatorStyle={{color: settings.colors.colorMain}} // mau` dau :
        timeToShow={['H', 'M', 'S']}
        timeLabels={{m: null, s: null}}
        showSeparator
      />
    </View>
  );
};

// var rootView;
// export default class TestingTimeCountDown extends Component {
//   constructor(props) {
//     super(props);
//     rootView = this;
//     this.socket = io('https://da-tot-nghiep.herokuapp.com', {jsonp: false});
//     this.state = {
//       isRunning: true,
//       textTimeStatus: 'Start',
//     };

//     this.socket.on('server-stop-time', function (data) {
//       console.log('server-stop-time ', data);
//       rootView.setState({isRunning: data});
//     });
//   }
//   getTimeStatus() {
//     console.log('Cai Gi Do :', this.state.isRunning);
//     return this.state.isRunning;
//   }

//   render() {
//     return (
//       <View style={{flex: 1, alignItems: 'center'}}>
//         <CountDown
//           size={16}
//           until={3600}
//           running={this.state.isRunning}
//           onFinish={() => {}}
//           digitStyle={{
//             backgroundColor: '#FFF',
//             borderWidth: 0,
//             borderColor: 'blue',
//           }}
//           digitTxtStyle={{color: settings.colors.colorMain}}
//           timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
//           separatorStyle={{color: settings.colors.colorMain}} // mau` dau :
//           timeToShow={['H', 'M', 'S']}
//           timeLabels={{m: null, s: null}}
//           showSeparator
//         />
//       </View>
//     );
//   }
// }
