import React, { useRef, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import Menu from './Menu';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BookDetailScreen from '../BookDetail';
import FavouriteBook from './FavouriteBook';
import NewUpdateBook from './NewUpdateBook';
import Footer from '../../common/Footer';
import { createStackNavigator } from '@react-navigation/stack';
import RankBook from '../RankBook';
import SearchScreen from '../SearchScreen';
import Comment from '../Comment';
import Reading from '../Reading';
import Header from '../../common/Header';
import FilterGenre from '../FilterGenre';
import GenerateScreen from '../Generate';
import ReadingTimesBook from './ReadingTimesBook';


const Drawer = createDrawerNavigator();


function Home({ navigation }: any) {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [key, setKey] = useState(0); // Add key to force re-render

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        // Simulate fetching new data
        setTimeout(() => {
            setKey(prevKey => (prevKey === 0 ? 1 : 0)); // Change key to force re-render
            setRefreshing(false);
        }, 2000);
    }, []);

    return (

        <ScrollView
            key={key}
            style={styles.container}

            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
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

            <View style={{ paddingHorizontal: 10 }}>
                <ReadingTimesBook />
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
                header: () => <Header />,
                // headerShown: false
            }}>

            <Stack.Screen name="HomeMain" component={Home} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Comment" component={Comment} />
            <Stack.Screen name="Reading" component={Reading} />
            <Stack.Screen name="FilterGenre" component={FilterGenre} />

            {/* <Stack.Screen name="FilterGenre" component={FilterGenre} /> */}
            {/* <Stack.Screen name="BookDetail" component={BookDetail} /> */}
            {/* <Stack.Screen name="Comment" component={Comment} /> */}
            {/* <Stack.Screen name="Reading" component={Reading} /> */}
            <Stack.Screen name="Generate" component={GenerateScreen} />

            <Stack.Screen name="RankBook" component={RankBook} />

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
