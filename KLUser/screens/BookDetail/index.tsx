import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';
import { FONT, SIZES } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import InformationBook from './Information';
import BookGenre from './BookGenre';
import ButtonFunction from './ButtonFunction';
import Introduction from './Introduction';
import Chapters from './Chapters';
import Comments from './Comments';
import ButtonBack from '../../common/ButtonBack';
import { useRoute } from '@react-navigation/native';
import apiClient from '../../hooks/ApiRequest/apiClient';
import { baseURL } from '../../constants';

type BookInfor = {
    id: number;
    book_name: string;
    other_name: string;
    artist: string;
    cover_image: string;
    nation: string;
    status: string;
    like_vote: number;
    reading_times: number;
    vote: number;
    rating: number;
    create_at: string;  // ISO 8601 format timestamp
    update_at: string;  // ISO 8601 format timestamp
    description: string;
};

export default function BookDetail() {
    const route = useRoute<any>();
    const bookId = route.params.idBook;

    const [bookInfor, setBookInfor] = useState<BookInfor | null>(null)
    const getBookInformation = async () => {
        try {
            const response = await apiClient.get(`books/${bookId}`);
            setBookInfor(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getBookInformation()
    })
    return (
        <ScrollView>
            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                <ButtonBack />

            </View>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Image
                        style={styles.image}
                        source={{ uri: `${baseURL}/${bookInfor?.cover_image}` }} />
                    <Text style={styles.bookName}>{bookInfor?.book_name}</Text>
                </View>

                <InformationBook otherName={bookInfor?.other_name}
                    artist={bookInfor?.artist}
                    status={bookInfor?.status}
                    likeVote={bookInfor?.like_vote}
                    reading_times={bookInfor?.reading_times}
                    vote={bookInfor?.vote}
                    rating={bookInfor?.rating}
                />
                <BookGenre id={Number(bookId)} />
                <ButtonFunction />
                <Introduction introduction={bookInfor?.description} />
                <Chapters id={Number(bookId)} />

                <Comments bookId={bookId} />
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
        marginTop: 20
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
        maxWidth: 300,
        textTransform: "capitalize",
        padding: 5
    },

});
