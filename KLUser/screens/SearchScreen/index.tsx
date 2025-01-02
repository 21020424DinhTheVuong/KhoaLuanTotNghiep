import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";

type SearchParam = {
    title: string,
    genre: string,
    rank: string
}
const DATA = [
    { id: '1', image: require('../../assets/one.jpg') },
    { id: '2', image: require('../../assets/one.jpg') },
    { id: '3', image: require('../../assets/one.jpg') },
    { id: '4', image: require('../../assets/one.jpg') },
    { id: '5', image: require('../../assets/one.jpg') },
    { id: '6', image: require('../../assets/one.jpg') },
];
export default function SearchScreen() {
    return (
        <ScrollView style={styles.container}>
            <SearchBar />

            <View style={styles.searchValue}>
                <SearchResult />
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        // display: "flex",
        // flexDirection: "row"
    },
    searchValue: {

    }
})