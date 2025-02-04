import React, { useState } from "react"
import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity, Touchable, Dimensions, Pressable } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Thể loại',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Xếp hạng',
    },

];
const DATA2 = [
    {
        id: '1',
        title: 'Diễn đàn',
        link: "forum",
        screen: "ForumScreen"
    },
]
const itemDropDownGenre = [
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


const itemDropDownRank = [
    // { id: 4, title: "Yêu Thích", link: "yeu-thich" },
    // { id: 5, title: "Mới Cập Nhật", link: "moi-cap-nhat" },
    { id: 6, title: "Truyện Mới", link: "Đang tiến hành" },
    { id: 7, title: "Truyện Full", link: "Hoàn thành" },
    // { id: 8, title: "Truyện Ngẫu Nhiên", link: "truyen-ngau-nhien" }
]

type ItemProps = { title: string, screen: string, action: any };
type ItemPropsDropDown = { title: string, icon: any, isOpen: boolean, toggle: any, action: any };

const Item = ({ title, screen, action }: ItemProps) => (
    <View>
        <View style={styles.item}>
            <TouchableOpacity onPress={() => { action(screen) }}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const ItemDropDown = ({ title, icon, isOpen, toggle, action }: ItemPropsDropDown) => (
    <View>
        <TouchableOpacity style={styles.item} onPress={toggle}>
            <Text style={styles.title}>{title}</Text>
            {icon}
        </TouchableOpacity>
        {
            isOpen &&
            <View style={[styles.itemChildren]}>
                {
                    title === "Thể loại" ?
                        itemDropDownGenre.map((item) => (
                            <Pressable key={item.id} onPress={() => { action("FilterGenre", item.title) }}
                            >
                                <Text style={[styles.childItem, { width: Dimensions.get("window").width * 0.4, backgroundColor: "white" }]}>{item.title}</Text>
                            </Pressable>
                        ))
                        :
                        itemDropDownRank.map((item) => (
                            <TouchableOpacity key={item.id} onPress={() => { action("RankBook", { rank: item.title, status: item.link }) }}>
                                <Text style={[styles.childItem, { width: Dimensions.get("window").width * 0.4, backgroundColor: "white" }]}>{item.title}</Text>
                            </TouchableOpacity>
                        ))
                }
            </View>
        }

    </View>
);
export default function Menu() {
    const navigation = useNavigation<any>()
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

    const toggleDropdown = (id: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the specific dropdown's open/close state
        }));
    };

    return (
        <View style={styles.container}>

            {
                DATA.map((item) => (
                    <ItemDropDown
                        key={item.id}
                        title={item.title}
                        icon={<Ionicons name="caret-down-outline" size={15} />}
                        isOpen={!!openDropdowns[item.id]} // Check if the dropdown is open
                        toggle={() => toggleDropdown(item.id)} // Pass the toggle function
                        action={(type: any, title: any) => { navigation.navigate(type, { genre: title }) }}
                    />
                ))
            }

            {
                DATA2.map((item) => (
                    <Item
                        key={item.id}
                        title={item.title}
                        screen={item.screen}
                        action={(type: any) => { navigation.navigate(type) }}
                    // action={(type: any) => { navigation.navigate("RankBook", { rank: type }) }}
                    />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#E4E6EB",
        paddingHorizontal: 20
    },
    item: {
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row', // Arrange title and icon in a row
        alignItems: 'center',  // Align vertically
        columnGap: 5,
        padding: 5,
        marginVertical: 8,
    },
    itemChildren: {
        flexDirection: 'row', // Items flow horizontally
        flexWrap: 'wrap', // Allow wrapping to multiple rows
        gap: 10,
        marginTop: 8,
    },
    childItem: {
        width: '48%', // Each item takes ~half of the container width
        padding: 5,
        fontSize: 14,
        backgroundColor: '#f0f0f0',
        textAlign: 'left', // Center the text
        marginBottom: 10, // Space between rows
        borderRadius: 5, // Optional: rounded corners
    },
    title: {
        fontSize: 16,
    },
});