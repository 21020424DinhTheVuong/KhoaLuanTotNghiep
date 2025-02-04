import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Button, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native'
import ButtonBack from '../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { useRoute } from '@react-navigation/native'
import apiClient from '../../hooks/ApiRequest/apiClient'
import { baseURL } from '../../constants'

const { width, height } = Dimensions.get("window")
type ChapterInterface = {
    id: number;
    page_number: number;
    image: string;
}
const Reading = () => {
    const route = useRoute<any>();
    const [chapterId, setChapterId] = useState(route.params.chapterId);
    const [title, setTitle] = useState(route.params.title);
    const [chapterNumber, setChapterNumber] = useState(route.params.chapterNumber);
    const totalChapter = route.params.totalChapter
    const [bookName, setBookName] = useState(route.params.bookName)
    // console.log(route)
    const [dataPages, setDataPages] = useState<ChapterInterface[]>([])
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const getPagesByChapterId = async () => {
        try {
            const response = await apiClient.get(`books/chapter/${chapterId}`)
            setDataPages(response.data);
            // console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPagesByChapterId()
    }, [])

    const handleChangeChapter = async (index: any) => {
        try {
            const response = await apiClient.get(`books/pages`, {
                params: { book_name: bookName, chapter_number: index },
            })
            setDataPages(response.data.pages)
            setTitle(response.data.chapter_title)
            setChapterId(response.data.chapter_id);
            setChapterNumber(response.data.chapter_number)
        } catch (error) {
            console.log(error)
        } finally {
            setModalVisible(false)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.buttonBack}>
                    <ButtonBack />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {title}
                        {/* <Text style={{ fontSize: 16 }}>Chap 1</Text> */}
                    </Text>
                </View>

                <View style={styles.buttonHandleChap}>
                    <TouchableOpacity style={[styles.pageButton, chapterNumber === 1 && styles.disabled]}
                        disabled={chapterNumber === 1}
                        onPress={() => { handleChangeChapter(Math.max(chapterNumber - 1, 1)) }}>
                        <Ionicons name="arrow-back" size={20} color={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.chapPicker} onPress={toggleModal}>
                        <Text>Chương {chapterNumber}</Text>
                        <Ionicons name='caret-down-outline' />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.pageButton, chapterNumber === totalChapter && styles.disabled]}
                        disabled={chapterNumber === totalChapter}
                        onPress={() => { handleChangeChapter(Math.min(chapterNumber + 1, totalChapter)) }}
                    >
                        <Ionicons name="arrow-forward" size={20} color={"white"} />
                    </TouchableOpacity>

                </View>

                <View style={styles.imageContainer}>
                    {
                        dataPages.map((item) => (
                            <Image
                                key={item.id}
                                source={{ uri: `${baseURL}/${item.image}` }}
                                style={styles.image}
                            // resizeMode="cover" 
                            />
                        ))
                    }
                </View>

                <View style={styles.buttonHandleChap}>
                    <TouchableOpacity style={[styles.pageButton, chapterNumber === 1 && styles.disabled]}
                        disabled={chapterNumber === 1}
                        onPress={() => { handleChangeChapter(Math.max(chapterNumber - 1, 1)) }}>
                        <Ionicons name="arrow-back" size={20} color={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.chapPicker} onPress={toggleModal}>
                        <Text>Chương {chapterNumber}</Text>
                        <Ionicons name='caret-down-outline' />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.pageButton, chapterNumber === totalChapter && styles.disabled]}
                        disabled={chapterNumber === totalChapter}
                        onPress={() => { handleChangeChapter(Math.min(chapterNumber + 1, totalChapter)) }}
                    >
                        <Ionicons name="arrow-forward" size={20} color={"white"} />
                    </TouchableOpacity>

                </View>

            </ScrollView>


            <View>
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={toggleModal} // Closes the modal when tapping outside
                    animationIn='zoomIn' // Custom animation for opening
                    animationOut='zoomOut'
                >
                    <View style={styles.modalPicker}>
                        <TouchableOpacity onPress={() => { toggleModal() }} style={{ marginLeft: "95%" }}>
                            <Ionicons name="close" size={20} />
                        </TouchableOpacity>
                        <ScrollView >
                            {Array.from({ length: totalChapter }, (_, index) => (
                                <TouchableOpacity key={index} onPress={() => { handleChangeChapter(totalChapter - index) }}>
                                    <Text style={styles.chap}>
                                        Chương {totalChapter - index}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

export default Reading

const styles = StyleSheet.create({
    container: {
        // marginHorizontal: 20,
        marginVertical: 20
    },
    buttonBack: {
        marginHorizontal: 20
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 350,
        marginHorizontal: 20

    },
    title: {
        fontSize: 20,
        fontWeight: 600
    },
    buttonHandleChap: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 30,
        marginVertical: 10,
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
    chapPicker: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 5
    },
    modalPicker: {
        maxHeight: height * 0.8,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        borderRadius: 5
        // alignItems: "center"
    },
    scrollChap: {

    },
    chap: {
        margin: 5,
        paddingLeft: "40%",
        // left: "50%",
        fontSize: 20,
        backgroundColor: "whitesmoke"
    },
    imageContainer: {
        display: "flex",
        flexDirection: "column",
        padding: 0, // Remove any container padding
        margin: 0,
        rowGap: 5
    },
    image: {
        objectFit: 'fill',
        width: width,
        height: height
        // height: "100%"
        // height: height * (15 / 16)
    },

})