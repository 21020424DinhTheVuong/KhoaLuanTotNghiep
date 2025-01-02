import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, } from "react-native";
import Book from "./Book";


const DATA = [
    { id: '1', image: require('../../assets/one.jpg') },
    { id: '2', image: require('../../assets/one.jpg') },
    { id: '3', image: require('../../assets/one.jpg') },
    { id: '4', image: require('../../assets/one.jpg') },
    { id: '5', image: require('../../assets/one.jpg') },
    { id: '6', image: require('../../assets/one.jpg') },

];
export default function NewUpdateBook() {

    return (
        <ScrollView style={styles.container}>

            <View style={styles.titleContainer}>
                <Ionicons name='cloud-download' size={25} />
                <Text style={styles.title}>Truyện mới cập nhật</Text>
            </View>
            <View style={styles.bookListContainer}>
                {
                    DATA.map((item) => (
                        <Book key={item.id} image_url={item.image} />
                    ))
                }
            </View>


        </ScrollView>
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
        // color: "red"
    },
    bookListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Adjust spacing between columns
        // width: Dimensions.get('window').width / 2 - 15, // Half screen width minus padding
        // marginBottom: 20, // Spacing between rows
        // alignItems: 'center',

    }
})