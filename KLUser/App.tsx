import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import BookDetailScreen from './screens/BookDetail';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from './common/Header';
import { Ionicons } from '@expo/vector-icons';
import Footer from './common/Footer';
import SearchScreen from './screens/SearchScreen';
import FilterGenre from './screens/FilterGenre';
import BookDetail from './screens/BookDetail';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          header: ({ navigation }: any) => <Header navigation={navigation} />
        }}>

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="FilterGenre" component={FilterGenre} />
        <Stack.Screen name="BookDetail" component={BookDetail} />
        {/* <Stack.Screen name="BookDetail" component={BookDetailScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
