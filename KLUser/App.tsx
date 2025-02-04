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
import Comment from './screens/Comment';
import Reading from './screens/Reading';
import RankBook from './screens/RankBook';
import Profile from './screens/Profile';
import LoginRegister from './screens/LoginRegister';
import ForumScreen from './screens/Fanpage';
import { AuthProvider, useAuth } from './hooks/Auth/authContext';
import AppNavigation from './AppNavigation';
export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>

  );
}
