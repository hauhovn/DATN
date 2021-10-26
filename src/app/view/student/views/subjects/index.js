import React from 'react';
import { View, Text } from 'react-native';
import { MyAppBar } from '../../components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

const Subjects = ({ navigation }) => {
    return (
        <View>
            <MyAppBar leftHandle={() => { navigation.goBack(); console.log(1); }} />
            <Tab.Navigation>
                <Tab.Screen name="CompleteSubjects" component={CompleteSubjects} />
                <Tab.Screen name="UncompleteSubjects" component={UncompleteSubjects} />
            </Tab.Navigation>
        </View>
    );
};

const CompleteSubjects = () => {
    return <View><Text>Comp</Text></View>
}
const UncompleteSubjects = () => {
    return <View><Text>123Comp</Text></View>
}


export default Subjects;