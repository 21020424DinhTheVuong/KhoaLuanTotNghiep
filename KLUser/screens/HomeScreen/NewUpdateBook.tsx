import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, } from "react-native";
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
export default function NewUpdateBook() {
    const [bookData, setBookData] = useState<BookType[]>([])
    const [loading, setLoading] = useState(false)
    const getNewUpdateBook = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get("books/new");

            setBookData(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getNewUpdateBook()
    }, [])
    return (
        <ScrollView style={styles.container}>

            <View style={styles.titleContainer}>
                <Ionicons name='cloud-download' size={25} />
                <Text style={styles.title}>Truyện mới cập nhật</Text>
            </View>
            {
                loading ?
                    <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 400 }}>
                        <ActivityIndicator size={30} />
                    </View>
                    :
                    <View style={styles.bookListContainer}>
                        {
                            bookData.map((item) => (
                                <Book key={item.id}
                                    id={item.id}
                                    image_url={item.cover_image}
                                    last_chapter={item.lastChapter}
                                    book_name={item.book_name}
                                    create_at={item.create_at} />
                            ))
                        }
                    </View>
            }

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