import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
//Screens
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TimeCountDown from '../../components/time-remote/time-countdown';
//Moduns
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Icon} from 'native-base';
import io from 'socket.io-client/dist/socket.io.js';
import {withNavigation} from 'react-navigation';
//others
import {settings} from '../../config';
import {appBar, body, navigator, styles} from './styles';
import {AppRouter} from '../../navigation/AppRouter';
import {testData} from './test-data';
import {Component} from 'react';
import TestingTimeCountDown from '../../components/time-remote/time-countdown';

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: testData[0],
      questionQuantity: testData.length,
      colorAnswerA: settings.colors.colorGreen,
      colorAnswerB: settings.colors.colorGreen,
      colorAnswerC: settings.colors.colorGreen,
      colorAnswerD: settings.colors.colorGreen,
    };
  }
  componentDidMount() {}
  componentDidUpdate() {}
  //

  updateQuestion(next, id = -1) {
    try {
      if (id != -1) {
        let num = parseInt(this.state.currentQuestion.stt);
        // const QUESTION_ID = route.params;
        // console.log('QUESTION_ID: ', QUESTION_ID);
        if (next) {
          if (num == testData.length)
            this.setState({currentQuestion: testData[0]});
          else
            this.setState({
              currentQuestion:
                testData[parseInt(this.state.currentQuestion.stt)],
            });
        } else {
          if (num == 1) {
            this.setState({currentQuestion: testData[testData.length - 1]});
          } else this.setState({currentQuestion: testData[num - 2]});
        }
        this.setState({currentQuestion: testData[QUESTION_ID.QUESTION_ID - 1]});
      } else {
      }
    } catch (error) {}
  }

  //
  pressingAnswer(answer) {
    this.setState({
      colorAnswerA: settings.colors.colorGreen,
      colorAnswerB: settings.colors.colorGreen,
      colorAnswerC: settings.colors.colorGreen,
      colorAnswerD: settings.colors.colorGreen,
    });
    switch (answer) {
      case 'A': {
        this.setState({
          colorAnswerA: settings.colors.colorMain,
        });
        break;
      }
      case 'B': {
        this.setState({
          colorAnswerB: settings.colors.colorMain,
        });
        break;
      }
      case 'C': {
        this.setState({
          colorAnswerC: settings.colors.colorMain,
        });
        break;
      }
      case 'D': {
        this.setState({
          colorAnswerD: settings.colors.colorMain,
        });
        break;
      }
      default:
    }
  }

  render() {
    const {navigation} = this.props;
    const add = navigation => {
      const QUESTION_ID = navigation.getParam('QUESTION_ID', 'NO-ID');
      this.setState({currentQuestion: testData[QUESTION_ID.QUESTION_ID - 1]});
    };
    //const {QUESTION_ID} = this.props.route.params;
    // const QUESTION_ID = navigation.getParam('QUESTION_ID', '1');
    // useEffect(() => {
    //   console.log(data);
    //   //this.setState({currentQuestion: testData[QUESTION_ID.QUESTION_ID - 1]});
    // }, [data]);
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={appBar.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack(); // Quay về màn hình trước
              }}
              style={appBar.leftButton}>
              <Icon
                type="MaterialIcons"
                name="keyboard-arrow-left"
                style={appBar.buttonIcon}
              />
            </TouchableOpacity>
            <Text style={appBar.textTitle}>THỜI GIAN</Text>
            <TestingTimeCountDown />
            <TouchableOpacity
              onPress={() => {
                // if (isTimeRunning) setIsTimeRunning(false);
                // else setIsTimeRunning(true);
              }}
              style={appBar.rightButton}>
              <Icon
                type="Ionicons"
                name={'ios-checkmark-done'}
                style={appBar.buttonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={body.container}>
            <View style={body.title}>
              <Text style={appBar.textTitle}>
                Câu: {this.state.currentQuestion.stt}
              </Text>
              <TouchableOpacity
                style={{paddingRight: 15}}
                onPress={() =>
                  this.props.navigation.navigate(AppRouter.MENU_QUESTION)
                }>
                <Icon
                  type="MaterialCommunityIcons"
                  name={'microsoft-xbox-controller-menu'}
                  style={appBar.buttonIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={body.question}>
              <ScrollView>
                <Text style={body.questionText}>
                  {'\t\t'}
                  {this.state.currentQuestion.cauhoi}
                </Text>
              </ScrollView>
            </View>
            <View style={body.answersContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.colorAnswerA != settings.colors.colorMain)
                    this.pressingAnswer('A');
                }}
                style={[
                  body.answer,
                  {backgroundColor: this.state.colorAnswerA},
                ]}>
                <Text styles={body.answerText}>
                  {' '}
                  {this.state.currentQuestion.a}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.colorAnswerB != settings.colors.colorMain)
                    this.pressingAnswer('B');
                }}
                style={[
                  body.answer,
                  {backgroundColor: this.state.colorAnswerB},
                ]}>
                <Text styles={body.answerText}>
                  {' '}
                  {this.state.currentQuestion.b}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.colorAnswerC != settings.colors.colorMain)
                    this.pressingAnswer('C');
                }}
                style={[
                  body.answer,
                  {backgroundColor: this.state.colorAnswerC},
                ]}>
                <Text styles={body.answerText}>
                  {' '}
                  {this.state.currentQuestion.c}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.colorAnswerD != settings.colors.colorMain)
                    this.pressingAnswer('D');
                }}
                style={[
                  body.answer,
                  {backgroundColor: this.state.colorAnswerD},
                ]}>
                <Text styles={body.answerText}>
                  {this.state.currentQuestion.d}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={navigator.container}>
            <TouchableOpacity
              onPress={() => {
                this.updateQuestion(false);
              }}>
              <Icon
                style={navigator.icon}
                type="Ionicons"
                name="arrow-undo-circle-outline"
              />
            </TouchableOpacity>
            <Text style={navigator.text}>
              {this.state.currentQuestion.stt}/{this.state.questionQuantity}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.updateQuestion(true);
              }}>
              <Icon
                style={navigator.icon}
                type="Ionicons"
                name="arrow-redo-circle-outline"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
