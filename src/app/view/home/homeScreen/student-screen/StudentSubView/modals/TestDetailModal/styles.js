import {Thumbnail} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {settings} from '../../../../../../../config';

let mainColor = settings.colors.colorMain;
var colorThumblr = settings.colors.colorThumblr;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: settings.colors.bg_fade,
  },
  box: {
    height: 350,
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.8,

    borderColor: settings.colors.colorMain,
    flexDirection: 'column',
  },
  buttonBox: {
    alignItems: 'flex-end',
  },
  button: {
    justifyContent: 'center',
    height: 38,
    width: 38,
    borderRadius: 20,
  },
  icon: {
    padding: 2,
    fontSize: 26,
    color: mainColor,
  },
  title: {
    margin: 20,
  },
  contact: {
    margin: 20,
  },
  time: {
    margin: 20,
  },
});

export const textStyles = StyleSheet.create({
  title: {
    color: settings.colors.colorGreen,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  date: {
    color: colorThumblr,
    fontSize: 14,
    margin: 2,
  },
  time: {
    color: colorThumblr,
    fontSize: 14,
  },
  contact: {
    color: colorThumblr,
    fontSize: 12,
  },
});

export const inputKeyBox = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 42,
    marginBottom: 20,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '80%',
  },
  inputText: {
    flex: 6,
    borderWidth: 0.6,
    borderColor: mainColor,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  button: {
    flex: 4,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mainColor,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderColor: mainColor,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});
