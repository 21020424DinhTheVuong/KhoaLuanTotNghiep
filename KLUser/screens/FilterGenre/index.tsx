import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import ButtonBack from '../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../hooks/useTheme'
import Book from '../HomeScreen/Book'
import ModalChooseFilter from './ModalChooseFilter'
import apiClient from '../../hooks/ApiRequest/apiClient'
import { formatDistance } from "date-fns"
import { formatTimeAgo } from '../../constants'


const dataGenre = [
    { id: 1, title: "Action", link: "action" },
    { id: 2, title: "Adventure", link: "adventure" },
    { id: 3, title: "Anime", link: "anime" },
    { id: 4, title: "Chuyển Sinh", link: "chuyen-sinh" },
    { id: 5, title: "Cổ Đại", link: "co-dai" },
    { id: 6, title: "Comedy", link: "comedy" },
    { id: 7, title: "Comic", link: "comic" },
    { id: 8, title: "Demons", link: "demons" },
    { id: 9, title: "Detective", link: "detective" },
    { id: 10, title: "Doujinshi", link: "doujinshi" },
    { id: 11, title: "Drama", link: "drama" },
    { id: 12, title: "Fantasy", link: "fantasy" },
    { id: 13, title: "Gender Bender", link: "gender-bender" },
    { id: 14, title: "Harem", link: "harem" },
    { id: 15, title: "Historical", link: "historical" },
    { id: 16, title: "Horror", link: "horror" },
    { id: 17, title: "Huyền Huyễn", link: "huyen-huyen" },
    { id: 18, title: "Isekai", link: "isekai" },
    { id: 19, title: "Josei", link: "josei" },
    { id: 20, title: "Mafia", link: "mafia" },
    { id: 21, title: "Magic", link: "magic" },
    { id: 22, title: "Manga", link: "manga" },
    { id: 23, title: "Manhua", link: "manhua" },
    { id: 24, title: "Manhwa", link: "manhwa" },
    { id: 25, title: "Martial Arts", link: "martial-arts" },
    { id: 26, title: "Military", link: "military" },
    { id: 27, title: "Mystery", link: "mystery" },
    { id: 28, title: "Ngôn Tình", link: "ngon-tinh" },
    { id: 29, title: "One shot", link: "one-shot" },
    { id: 30, title: "Psychological", link: "psychological" },
    { id: 31, title: "Romance", link: "romance" },
    { id: 32, title: "School Life", link: "school-life" },
    { id: 33, title: "Sci-fi", link: "sci-fi" },
    { id: 34, title: "Seinen", link: "seinen" },
    { id: 35, title: "Shoujo", link: "shoujo" },
    { id: 36, title: "Shoujo Ai", link: "shoujo-ai" },
    { id: 37, title: "Shounen", link: "shounen" },
    { id: 38, title: "Shounen Ai", link: "shounen-ai" },
    { id: 39, title: "Slice of life", link: "slice-of-life" },
    { id: 40, title: "Sports", link: "sports" },
    { id: 41, title: "Supernatural", link: "supernatural" },
    { id: 42, title: "Tragedy", link: "tragedy" },
    { id: 43, title: "Trọng Sinh", link: "trong-sinh" },
    { id: 44, title: "Truyện Màu", link: "truyen-mau" },
    { id: 45, title: "Webtoon", link: "webtoon" },
    { id: 46, title: "Xuyên Không", link: "xuyen-khong" }
]

const dataStatus = [
    { id: 1, title: "Đang tiến hành", link: "updating" },
    { id: 2, title: "Hoàn thành", link: "done" },
]
const dataNation = [
    { id: 1, title: "Nhật Bản", link: "japan", },
    { id: 2, title: "Hàn Quốc", link: "korea" },
    { id: 3, title: "Mỹ", link: "america" },
    { id: 4, title: "Việt Nam", link: "vietnam" },
    { id: 5, title: "Trung Quốc", link: "china" },
]
const dataFilter = [
    { id: 1, title: "Ngày đăng giảm dần", link: "postTime", order: "DESC" },
    { id: 2, title: "Ngày đăng tăng dần", link: "postTime", order: "ASC" },
    { id: 3, title: "Ngày cập nhật giảm dần", link: "updateTime", order: "DESC" },
    { id: 4, title: "Ngày cập nhật tăng dần", link: "updateTime", order: "ASC" },
]
type BookType = {
    id: number;
    book_name: string,
    cover_image: string;
    create_at: string;
    lastChapter: number;
    timeAgo?: string
}

const FilterGenre: React.FC = () => {
    const route = useRoute<any>()
    const type = route.params.genre;

    const [showGenre, setShowGenre] = useState(false)
    const handleShowGenreModal = () => {
        setShowGenre(!showGenre);
    }
    const [showStatus, setShowStatus] = useState(false)
    const handleShowStatusModal = () => {
        setShowStatus(!showStatus);
    }
    const [showNation, setShowNation] = useState(false)
    const handleShowNationModal = () => {
        setShowNation(!showNation);
    }
    const [showFilter, setShowFilter] = useState(false)
    const handleShowFilterModal = () => {
        setShowFilter(!showFilter);
    }

    const [bookType, setBookType] = useState(type)
    const [genreInfor, setGenreInfor] = useState('')
    const [status, setStatus] = useState("Đang tiến hành")
    const [nation, setNation] = useState("Nhật Bản");
    const [filter, setFilter] = useState("Ngày đăng giảm dần")

    useEffect(() => {
        const getGenreInfor = async () => {
            try {
                const response = await apiClient.get("genres", {
                    params: { title: bookType }
                })
                setGenreInfor(response.data.describe)
            } catch (error) {
                console.log(error)
            }
        }
        getGenreInfor()
    }, [bookType])

    const [dataBook, setBookData] = useState<BookType[]>([]);
    useEffect(() => {
        const getDataBook = async () => {
            try {
                const response = await apiClient.get("books/filter", {
                    params: {
                        genre: bookType,
                        status: status,
                        nation: nation,
                        filter: filter.includes("đăng") ? "postTime" : "updateTime",
                        order: filter.includes("giảm") ? "DESC" : "ASC"
                    }
                })

                setBookData(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getDataBook();
    }, [bookType, status, nation, filter])
    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                <ButtonBack />
            </View>

            <View style={styles.titleContainer}>
                <Ionicons name="flag" color={"#56ccf2"} size={30} />
                <Text style={{ textTransform: "capitalize", fontSize: 30, color: "#56ccf2", fontWeight: 600 }}>Truyện {bookType}</Text>
            </View>

            <ScrollView>
                <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: "white", padding: 10, borderRadius: 3 }}>
                    <Text style={{ fontSize: 16 }}>{genreInfor}</Text>
                </View>

                <View style={styles.filterContainer}>

                    <View style={[styles.titleChildren, { rowGap: 22 }]}>
                        <Text style={styles.titleFilter}>Thể loại truyện</Text>
                        <Text style={styles.titleFilter}>Tình trạng</Text>
                        <Text style={styles.titleFilter}>Quốc gia</Text>
                        <Text style={styles.titleFilter}>Sắp xếp</Text>
                    </View>

                    <View style={styles.titleChildren}>
                        <TouchableOpacity style={styles.chooseFilter} onPress={() => { handleShowGenreModal() }}>
                            <Text style={styles.titleFilter}>{bookType}</Text>
                            <Ionicons name='caret-down' size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chooseFilter} onPress={() => { handleShowStatusModal() }}>

                            <Text style={styles.titleFilter}>{status}</Text>
                            <Ionicons name='caret-down' size={18} />

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chooseFilter} onPress={() => { handleShowNationModal() }}>

                            <Text style={styles.titleFilter}>{nation}</Text>
                            <Ionicons name='caret-down' size={18} />

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chooseFilter} onPress={() => { handleShowFilterModal() }}>

                            <Text style={styles.titleFilter}>{filter}</Text>
                            <Ionicons name='caret-down' size={18} />

                        </TouchableOpacity>

                    </View>
                </View>
                <ModalChooseFilter data={dataGenre} visible={showGenre} onClose={() => handleShowGenreModal()} onSelect={setBookType} />
                <ModalChooseFilter data={dataStatus} visible={showStatus} onClose={() => handleShowStatusModal()} onSelect={setStatus} />
                <ModalChooseFilter data={dataNation} visible={showNation} onClose={() => handleShowNationModal()} onSelect={setNation} />
                <ModalChooseFilter data={dataFilter} visible={showFilter} onClose={() => handleShowFilterModal()} onSelect={setFilter} />

                {/* <View style={styles.bookListContainer}> */}
                <View style={styles.bookListContainer}>
                    {
                        dataBook.length > 0 ?
                            <View style={styles.bookListContainer}>
                                {
                                    dataBook.map((item) => (
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
                {/* </View> */}
            </ScrollView>
        </View>
    )
}

export default FilterGenre

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
        columnGap: 15
    },
    titleChildren: {
        rowGap: 10
    },
    titleFilter: {
        fontSize: 16,
        textTransform: "capitalize"
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