import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const chapters = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Chuong ${index + 1}`,
    date: "29/12/2024",
}));
const Chapters = () => {
    const navigation = useNavigation<any>()
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(chapters.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = chapters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Ionicons name='layers' size={20} />
                <Text style={{ fontSize: 20 }}>Danh sách chương</Text>
            </View>

            {/* <View style={styles.chapterContainer}>
                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chapterChildren}>
                    <Text style={styles.chapterNumber}>Chuong 1</Text>
                    <Text style={styles.chapterUpdate}>29/12/2024</Text>
                </TouchableOpacity>
            </View> */}

            <View style={styles.chapterContainer}>
                {currentItems.map((chapter) => (
                    <TouchableOpacity key={chapter.id} style={styles.chapterChildren}
                        onPress={() => { navigation.navigate("Reading") }}
                    >
                        <Text style={styles.chapterNumber}>{chapter.name}</Text>
                        <Text style={styles.chapterUpdate}>{chapter.date}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.pagination}>
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.disabled]}
                    onPress={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    {/* <Text>Previous</Text> */}
                    <Ionicons name="arrow-back" size={20} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                </Text>
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === totalPages && styles.disabled]}
                    onPress={handleNextPage}
                    disabled={currentPage === totalPages}
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