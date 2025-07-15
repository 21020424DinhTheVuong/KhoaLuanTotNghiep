import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../hooks/ApiRequest/apiClient';


type IDBook = {
    id: number
}
type ChapterInterface = {
    chapter_id: number;
    title: string;
    chapter_number: number;
    create_at: string
}
const Chapters = ({ id }: IDBook) => {
    const navigation = useNavigation<any>()
    // const ITEMS_PER_PAGE = 10;
    // const [currentPage, setCurrentPage] = useState(1);

    // // Calculate pagination
    // const totalPages = Math.ceil(chapters.length / ITEMS_PER_PAGE);
    // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    // const currentItems = chapters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // const handleNextPage = () => {
    //     if (currentPage < totalPages) {
    //         setCurrentPage(currentPage + 1);
    //     }
    // };
    // const handlePreviousPage = () => {
    //     if (currentPage > 1) {
    //         setCurrentPage(currentPage - 1);
    //     }
    // };

    const [page, setPage] = useState(1);
    const [chapters, setChapters] = useState<ChapterInterface[]>([]);
    const [totalPage, setTotalPage] = useState(1)
    const [totalChapter, setTotalChapter] = useState(0)
    const [bookName, setBookName] = useState("")
    const fetchChapters = async () => {
        try {
            const response = await apiClient.get(`/books/${id}/chapters?page=${page}`);
            setChapters(response.data.data);
            setTotalChapter(response.data.total)
            setBookName(response.data.book_name)
            // console.log(response.data.data)
            setTotalPage(response.data.totalPages === 0 ? 1 : response.data.tottalPages)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchChapters();
    }, [page]);
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Ionicons name='layers' size={20} />
                <Text style={{ fontSize: 20 }}>Danh sách chương</Text>
            </View>

            <View style={styles.chapterContainer}>
                {chapters.map((chapter, index) => (
                    <TouchableOpacity key={index} style={styles.chapterChildren}
                        onPress={() => {
                            navigation.navigate("Reading",
                                {
                                    chapterId: chapter.chapter_id, chapterNumber: chapter.chapter_number, title: chapter.title,
                                    totalChapter: totalChapter, bookName: bookName
                                })
                        }}
                    >
                        <Text style={styles.chapterNumber}>Chương {chapter.chapter_number}</Text>
                        <Text style={styles.chapterUpdate}>{chapter.create_at.split("T")[0]}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.pagination}>
                <TouchableOpacity
                    style={[styles.pageButton, page === 1 && styles.disabled]}
                    onPress={() => { setPage(pre => pre - 1) }}
                    disabled={page === 1}
                >
                    {/* <Text>Previous</Text> */}
                    <Ionicons name="arrow-back" size={20} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.pageInfo}>
                    Page {page} of {totalPage}
                </Text>
                <TouchableOpacity
                    style={[styles.pageButton, page === totalPage && styles.disabled]}
                    onPress={() => { setPage(pre => pre + 1) }}
                    disabled={page === totalPage}
                >
                    <Ionicons name="arrow-forward" size={20} color={"white"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Chapters

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginHorizontal: 25,
        display: "flex"
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        // justifyContent: 'flex-start'
    },
    chapterContainer: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        rowGap: 5
    },
    chapterChildren: {
        // maxWidth: "90%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 30,
        marginTop: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    chapterNumber: {

    },
    chapterUpdate: {

    },
    pagination: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pageButton: {
        padding: 10,
        backgroundColor: "red",
        borderRadius: 5,
    },
    pageInfo: {
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
})