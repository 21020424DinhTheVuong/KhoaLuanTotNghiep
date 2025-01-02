import React from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import Book from '../HomeScreen/Book';

const DATA = [
    { id: '1', image: require('../../assets/one.jpg') },
    { id: '2', image: require('../../assets/one.jpg') },
    { id: '3', image: require('../../assets/one.jpg') },
    { id: '4', image: require('../../assets/one.jpg') },
    { id: '5', image: require('../../assets/one.jpg') },
    { id: '6', image: require('../../assets/one.jpg') },

];
const SearchResult = () => {
    return (
        <ScrollView>

            <View style={styles.bookListContainer}>
                {
                    DATA.map((item) => (
                        <Book key={item.id} image_url={item.image} />
                    ))
                }
                <Text style={{ fontWeight: 700 }}>
                    NO BOOKS FOUND.
                </Text>
            </View>


        </ScrollView>
    )
}

export default SearchResult

const styles = StyleSheet.create({
    bookListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    }
})