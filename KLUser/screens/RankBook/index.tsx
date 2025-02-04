import { useRoute, } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import ButtonBack from '../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../hooks/useTheme'
import Book from '../HomeScreen/Book'
import ModalChooseFilter from './ModalChooseFilter'
import apiClient from '../../hooks/ApiRequest/apiClient'
import { formatDistance } from "date-fns"
import { formatTimeAgo } from '../../constants'



const dataStatus = [
    { id: 1, title: "Đang tiến hành", link: "updating" },
    { id: 2, title: "Hoàn thành", link: "done" },
]
const dataNation = [
    { id: 1, title: "Nhật Bản", link: "japan" },
    { id: 2, title: "Hàn Quốc", link: "korea" },
    { id: 3, title: "Mỹ", link: "america" },
    { id: 4, title: "Việt Nam", link: "vietnam" },
    { id: 5, title: "Trung Quốc", link: "china" },
]

type BookType = {
    id: number;
    book_name: string,
    cover_image: string;
    create_at: string;
    lastChapter: number;
    timeAgo?: string
}
const RankBook: React.FC = () => {
    const route = useRoute<any>()
    const [rank, setRank] = useState<string>(route.params.genre.rank);
    const [status, setStatus] = useState<string>(route.params.genre.status);

    const [showStatus, setShowStatus] = useState(false)
    const handleShowStatusModal = () => {
        setShowStatus(!showStatus);
    }
    const [showNation, setShowNation] = useState(false)
    const handleShowNationModal = () => {
        setShowNation(!showNation);
    }


    useEffect(() => {
        setRank(status === "Đang tiến hành" ? "Truyện Mới" : "Truyện Full");
    }, [status]);
    const [nation, setNation] = useState("Nhật Bản")

    const [bookData, setBookData] = useState<BookType[]>([])
    useEffect(() => {
        const getDataBook = async () => {
            try {
                const response = await apiClient.get("books/filter-rank", {
                    params: {
                        // genre: "",
                        status: status,
                        nation: nation,
                        // filter: "postTime",
                        // order: "ASC"
                    }
                })

                setBookData(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getDataBook();
    }, [status, nation])
    // console.log(type)
    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                <ButtonBack />
            </View>

            <View style={styles.titleContainer}>
                <Ionicons name="flag" color={"#56ccf2"} size={30} />
                <Text style={{ textTransform: "capitalize", fontSize: 30, color: "#56ccf2", fontWeight: 600 }}>{rank}</Text>
            </View>

            <ScrollView>

                <View style={styles.filterContainer}>

                    <View style={[styles.titleChildren, { rowGap: 22 }]}>
                        <Text style={styles.titleFilter}>Tình trạng</Text>
                        <Text style={styles.titleFilter}>Quốc gia</Text>
                    </View>

                    <View style={styles.titleChildren}>
                        <TouchableOpacity style={styles.chooseFilter} onPress={() => { handleShowStatusModal() }}>
                            <Text style={styles.titleFilter}>{status}</Text>
                            <Ionicons name='caret-down' size={18} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.chooseFilter} onPress={() => { handleShowNationModal() }}>
                            <Text style={styles.titleFilter}>{nation}</Text>
                            <Ionicons name='caret-down' size={18} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ModalChooseFilter data={dataStatus} onClose={handleShowStatusModal} visible={showStatus} onSelect={setStatus} />
                <ModalChooseFilter data={dataNation} onClose={handleShowNationModal} visible={showNation} onSelect={setNation} />
                {/* <ModalChooseFilter data={dataFilter} onClose={handleShowFilterModal} visible={showFilter} /> */}
                <View style={styles.bookListContainer}>
                    {
                        bookData.length > 0 ?
                            <View style={styles.bookListContainer}>
                                {
                                    bookData.map((item) => (
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
                </View>
            </ScrollView>
        </View>
    )
}

export default RankBook

const styles = StyleSheet.create({
    container: {

    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginLeft: 20
    },
    filterContainer: {
        backgroundColor: "white",
        borderRadius: 3,
        padding: 10,
        marginHorizontal: 20,
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        columnGap: 20
    },
    titleChildren: {
        rowGap: 10
    },
    titleFilter: {
        fontSize: 18
    },
    chooseFilter: {
        paddingLeft: 10,

        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "auto",
        backgroundColor: COLORS.gray2,
        padding: 5,
        borderRadius: 4
    },
    bookListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 80,
        marginTop: 20
    }
})