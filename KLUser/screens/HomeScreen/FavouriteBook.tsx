import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import Book from "./Book";
import apiClient from "../../hooks/ApiRequest/apiClient";
import { formatDistance } from "date-fns"
import { formatTimeAgo } from "../../constants";

type BookType = {
    id: number;
    book_name: string,
    cover_image: string;
    create_at: string;
    lastChapter: number;
    timeAgo?: string
}

export default function FavouriteBook() {
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollPosition = useRef(0);
    const screenWidth = Dimensions.get('window').width;
    const [loading, setLoading] = useState(false)

    const [bookData, setBookData] = useState<BookType[]>([])

    const getFavouriteBook = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get("books/top");

            setBookData(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getFavouriteBook()
    }, [])
    useEffect(() => {
        const interval = setInterval(() => {
            scrollPosition.current += screenWidth / 2 - 15;
            if (scrollPosition.current >= screenWidth * bookData.length) {
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
            {
                loading ?
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={30} />
                    </View>
                    :

                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContainer}
                    >
                        {
                            bookData.map((item) => (
                                <Book key={item.id}
                                    id={item.id}
                                    image_url={item.cover_image}
                                    book_name={item.book_name}
                                    create_at={item.create_at}
                                    last_chapter={item.lastChapter} />
                            ))
                        }
                    </ScrollView>

            }
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