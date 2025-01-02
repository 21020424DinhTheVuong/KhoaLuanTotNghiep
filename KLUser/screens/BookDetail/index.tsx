import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';
import { FONT, SIZES } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import InformationBook from './Information';
import BookGenre from './BookGenre';
import ButtonFunction from './ButtonFunction';
import Introduction from './Introduction';
import Chapters from './Chapters';
import Comments from './Comments';

export default function BookDetail({ navigation }: any) {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/one.jpg')} />
                    <Text style={styles.bookName}>One PiecePiecePiecePiecePiecePiecePiecePiecePiecePiecePiece</Text>
                </View>

                <InformationBook />
                <BookGenre />
                <ButtonFunction />
                <Introduction />
                <Chapters />

                <Comments />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#e9ecef',
        marginTop: 30
    },
    title: {
        // width: "75%",
        // maxWidth: 250,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        borderRadius: 20,
        height: 300,
        width: 200
    },
    bookName: {
        fontSize: SIZES.large,
        fontWeight: 700,
        maxWidth: 300
    },

});
