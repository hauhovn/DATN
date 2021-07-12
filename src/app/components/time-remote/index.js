import React, {useState} from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
//moduns
import io from 'socket.io-client/dist/socket.io.js';
//
import {AppRouter} from '../../navigation/AppRouter';

// const RemoteTime = () => {
//   const socket = io('https://da-tot-nghiep.herokuapp.com', {jsonp: false});
//   const [stopTime, setStopTime] = useState(false);
//   const [textTimeStatus, setTextTimeStatus] = useState('Stop');

//   const clickStartTime = () => {
//     socket.emit('client-stop-time', stopTime);
//     if (stopTime) {
//       // this.setState({ textTimeStatus: 'Stop', stopTime: false });
//       setTextTimeStatus('Stop');
//       setStopTime(false);
//     } else {
//       // this.setState({ textTimeStatus: 'Start', stopTime: true });
//       setTextTimeStatus('Start');
//       setStopTime(true);
//     }
//     console.log('RemoteTime: ', stopTime);
//   };

//   return (
//     <View style={{flex: 1, alignItems: 'center'}}>
//       <TouchableOpacity
//         onPress={() => {
//           clickStartTime();
//         }}
//         style={{
//           padding: 30,
//           borderWidth: 1,
//           margin: 10,
//           borderRadius: 50,
//         }}>
//         <Text style={{fontSize: 32}}>{textTimeStatus}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export {RemoteTime};

export class RemoteTime extends Component {
  constructor(props) {
    super(props);
    this.socket = io('https://da-tot-nghiep.herokuapp.com', {jsonp: false});
    this.state = {
      stopTime: false,
      textTimeStatus: 'Stop',
    };
  }
  clickStartTime() {
    this.socket.emit('client-stop-time', this.state.stopTime);
    if (this.state.stopTime) {
      this.setState({textTimeStatus: 'Stop', stopTime: false});
    } else {
      this.setState({textTimeStatus: 'Start', stopTime: true});
    }
    console.log(this.state.stopTime);
  }
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            this.clickStartTime();
          }}
          style={{
            padding: 30,
            borderWidth: 1,
            margin: 10,
            borderRadius: 50,
          }}>
          <Text style={{fontSize: 32}}>{this.state.textTimeStatus}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
