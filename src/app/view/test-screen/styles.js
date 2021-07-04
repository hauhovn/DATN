import {StyleSheet, Dimensions} from 'react-native';
import {settings} from '../../config';

export {styles, appBar, body, navigator, menuQuestion};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
const {width, height} = Dimensions.get('window');
const appBar = StyleSheet.create({
  container: {
    width: '100%',
    height: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  leftButton: {
    width: 100,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
  },
  rightButton: {
    width: 100,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: settings.colors.colorMain,
  },
  buttonIcon: {
    fontSize: 26,
    color: settings.colors.colorMain,
  },
});
const body = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  question: {flex: 4, backgroundColor: '#fff'},
  questionText: {padding: 8, fontSize: 18},
  answersContainer: {
    flex: 6,
    backgroundColor: '#fff',
    paddingTop: 15,
  },
  answer: {
    flex: 0.238,
    borderRadius: 8,
    margin: 8,
    padding: 8,
  },
  answerText: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
  },
});
const navigator = StyleSheet.create({
  container: {
    height: 42,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '30%',
  },
  icon: {
    color: settings.colors.colorMain,
    fontSize: 32,
  },
  text: {color: settings.colors.colorMain, fontSize: 22},
});
const menuQuestion = StyleSheet.create({
  icon: {
    height: width / 7,
    width: width / 7,
    marginHorizontal: 10,
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
});
