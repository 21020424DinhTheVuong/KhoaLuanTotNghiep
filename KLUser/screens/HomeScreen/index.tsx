import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, DrawerLayoutAndroid, ScrollView } from 'react-native';
import Menu from './Menu';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BookDetailScreen from '../BookDetail';
import FavouriteBook from './FavouriteBook';
import NewUpdateBook from './NewUpdateBook';
import Footer from '../../common/Footer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStackParamList } from '../../ScreenStack';
import Comment from '../Comment';
import Reading from '../Reading';

const Drawer = createDrawerNavigator();


function Home({ navigation }: any) {
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    return (

        <ScrollView style={styles.container}>
            <View style={styles.homeHeaderStyle}>
                {/* <Text style={styles.title}>Trang chủ</Text> */}
                <TouchableOpacity onPress={() => setIsOpenMenu(!isOpenMenu)}>
                    {
                        isOpenMenu
                            ?
                            <Ionicons name='close-outline' size={30} />
                            :
                            <Ionicons name='menu-outline' size={30} />
                    }
                </TouchableOpacity>
            </View>

            <View>
                {
                    isOpenMenu && <Menu />
                }
            </View>

            <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
                <FavouriteBook />
            </View>

            <View style={{ paddingHorizontal: 10 }}>
                <NewUpdateBook />
            </View>
            <View>
                <Footer />
            </View>
        </ScrollView>
    );
}

const Stack = createStackNavigator()
export default function HomeScreen() {
    return (
        <Stack.Navigator initialRouteName='HomeMain'
            screenOptions={{
                headerShown: false
            }}>

            <Stack.Screen name="HomeMain" component={Home} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="Comment" component={Comment} />
            <Stack.Screen name="Reading" component={Reading} />
        </Stack.Navigator>
    )
}
const styles = StyleSheet.create({
    container: {
        // paddingHorizontal: 10
    },
    homeHeaderStyle: {
        // flex: 1,
        height: 40,
        display: "flex",
        // flexDirection: "row",
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: '#f8f9fa',
        marginVertical: 10,
        marginHorizontal: 10
        // marginHorizontal: 10
    },
    title: {
        textDecorationLine: "underline",
        fontSize: 20
    },

});
