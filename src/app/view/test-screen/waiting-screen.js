import React from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
//moduns
import io from 'socket.io-client/dist/socket.io.js';
//
import {AppRouter} from '../../navigation/AppRouter';
import {RemoteTime} from '../../components/time-remote';

export default class WaitingScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <RemoteTime ref="RemoteTimeRef" />
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate(AppRouter.TESTING);
          }}
          style={{padding: 30, borderWidth: 1, margin: 10, borderRadius: 50}}>
          <Text>Testing</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
