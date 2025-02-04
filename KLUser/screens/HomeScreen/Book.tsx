import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Image, Dimensions, Animated, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { baseURL } from "../../constants";
import { formatTimeAgo } from "../../constants";

type BookInfor = {
    id: number
    book_name: string;
    create_at: string | any;
    last_chapter: number;
    image_url: any,
}
export default function Book({ id, image_url, book_name, create_at, last_chapter }: BookInfor) {
    const navigation = useNavigation<any>()
    const blinkOpacity = useRef(new Animated.Value(1)).current;

    // Blinking animation
    useEffect(() => {
        const blinking = Animated.loop(
            Animated.sequence([
                Animated.timing(blinkOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkOpacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        blinking.start();

        // Cleanup animation on unmount
        return () => blinking.stop();
    }, [blinkOpacity]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { idBook: id })}>
                <Image
                    style={styles.imageBook}
                    source={{ uri: `${baseURL}/${image_url}` }}
                />
            </TouchableOpacity>
            <View style={styles.timeUpdate}>
                <Text style={styles.timeStampText}>{formatTimeAgo(create_at)}</Text>
                <Animated.Text style={[styles.hotText, { opacity: blinkOpacity }]}>Hot</Animated.Text>

            </View>
            {/* <View style={styles.timeUpdate}>
            </View> */}
            <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { idBook: id })}>
                <Text style={styles.bookName}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {book_name}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { idBook: id })}>
                <Text style={{ fontSize: 14 }}>Chap {last_chapter}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width / 2 - 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        // borderWidth: 1
    },
    timeUpdate: {
        position: 'absolute',
        display: "flex",
        flexDirection: "row",
        top: 5, // Distance from the top of the container
        left: 25, // Distance from the left of the container
        paddingVertical: 2,
        columnGap: 10
    },
    imageBook: {
        borderRadius: 10,
        width: 140,
        height: 200,
        resizeMode: 'contain',
    },
    bookName: {
        fontWeight: 600,
        fontSize: 15,
        textTransform: "capitalize"
    },
    timeStampText: {
        color: "white",
        fontSize: 12,
        backgroundColor: '#56ccf2',
        paddingHorizontal: 5,
        borderRadius: 3,
    },
    hotText: {
        backgroundColor: 'red',
        color: 'white',
        fontSize: 12,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3,
        fontWeight: 'bold',
    },
})