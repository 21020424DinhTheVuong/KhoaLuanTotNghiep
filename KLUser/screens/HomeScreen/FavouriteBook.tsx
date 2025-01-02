import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import Book from "./Book";


const DATA = [
    { id: '1', image: require('../../assets/one.jpg') },
    { id: '2', image: require('../../assets/one.jpg') },
    { id: '3', image: require('../../assets/one.jpg') },
    { id: '4', image: require('../../assets/one.jpg') },
    { id: '5', image: require('../../assets/one.jpg') },
    { id: '6', image: require('../../assets/one.jpg') },

];
export default function FavouriteBook() {
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollPosition = useRef(0);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        const interval = setInterval(() => {
            scrollPosition.current += screenWidth / 2 - 15;
            if (scrollPosition.current >= screenWidth * DATA.length) {
                scrollPosition.current = 0; // Reset to the beginning for infinite scroll
            }

            scrollViewRef.current?.scrollTo({
                x: scrollPosition.current,
                animated: true,
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [screenWidth]);

    return (
        <View style={styles.container}>

            <View style={styles.titleContainer}>
                <Ionicons name='star' size={25} color="red" />
                <Text style={styles.title}>Truyện hay</Text>
            </View>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}
            >
                {
                    DATA.map((item) => (
                        <Book key={item.id} image_url={item.image} />
                    ))
                }
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //    th: Dimensions.get('window').width / 2,
        //     alignItems: 'center',
        //     justifyContent: 'center',
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    title: {
        fontSize: 25,
        fontWeight: 600,
        color: "red"
    },
    scrollViewContainer: {
        alignItems: 'center',
        // marginLeft: 10
    },
})