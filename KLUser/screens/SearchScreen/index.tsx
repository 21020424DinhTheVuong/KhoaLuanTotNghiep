import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ButtonBack from "../../common/ButtonBack";
import apiClient from "../../hooks/ApiRequest/apiClient";
import Book from "../HomeScreen/Book";
import { formatDistance } from "date-fns"
import { formatTimeAgo } from "../../constants";

type SearchParam = {
    title: string,
    genre: string,
    rank: string
}
type BookType = {
    id: number;
    book_name: string,
    cover_image: string;
    create_at: string;
    lastChapter: number;
    timeAgo?: string
}

export default function SearchScreen() {
    const [text, onChangeText] = useState('');

    const [dataSearch, setDataSearch] = useState<BookType[]>([])

    const handleSearchBook = async (text: any) => {
        try {
            const response = await apiClient.get("books/search", {
                params: { bookName: text.trim(" ") }
            })

            setDataSearch(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ScrollView style={styles.container}>
            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                <ButtonBack />

            </View>

            <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Tìm kiếm truyện"
                    returnKeyType="search" // Hiển thị nút "Search" trên bàn phím
                    onSubmitEditing={() => handleSearchBook(text)} // Gọi khi nhấn "Xong" hoặc "Done"
                    blurOnSubmit={true}
                />
                <TouchableOpacity
                    // style={{ top: -40 }} 
                    style={styles.icon}
                    onPress={() => { handleSearchBook(text) }}>
                    <Ionicons name="search" size={20} color="black" />
                    {/* <Text>Tk</Text> */}
                </TouchableOpacity>
            </View>

            <View >
                {/* <SearchResult /> */}
                <ScrollView>
                    {
                        dataSearch.length > 0 ?
                            <View style={styles.bookListContainer}>
                                {
                                    dataSearch.map((item) => (
                                        // <Book key={item.id} image_url={item.image} />
                                        <Book
                                            key={item.id}
                                            id={item.id}
                                            image_url={item.cover_image}
                                            book_name={item.book_name}
                                            create_at={item.create_at}
                                            last_chapter={item.lastChapter} />
                                    ))
                                }

                            </View>

                            :
                            <View style={styles.bookListContainer}>

                                <Text style={{ fontWeight: 700 }}>
                                    Không tìm thấy tên sách.
                                </Text>
                            </View>
                    }
                </ScrollView>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        // display: "flex",
        // flexDirection: "row"
    },
    searchBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        marginHorizontal: 32,
        paddingHorizontal: 10,
        borderRadius: 20
    },
    input: {
        // height: 40,
        margin: 5,
        width: "80%"
        // borderWidth: 1,
        // borderRadius: 10,
        // padding: 10,
        // marginHorizontal: 32,
    },
    icon: {
        // position: 'absolute',
        // right: 45,
    },
    bookListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 10
    }
})