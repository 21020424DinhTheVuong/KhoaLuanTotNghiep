import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'

const Introduction = () => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpenIntroduction = () => {
        setIsOpen(!isOpen)
    }
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Ionicons name='information-circle' size={18} />
                <Text style={styles.title}>Giới thiệu</Text>
            </View>

            <View style={{ borderBottomWidth: 1 }}>
                {isOpen ? (
                    // Hiển thị toàn bộ nội dung nếu isOpen = true
                    <Text style={styles.content}>
                        Onepunch-Man là một Manga thể loại siêu anh hùng với đặc trưng phồng tôm đấm phát chết luôn… Lol!!!
                        Nhân vật chính trong Onepunch-man là Saitama, một con người mà nhìn đâu cũng thấy “tầm thường”, từ khuôn mặt vô hồn, cái đầu trọc lóc, cho tới thể hình long tong.
                        Tuy nhiên, con người nhìn thì tầm thường này lại chuyên giải quyết những vấn đề hết sức bất thường.
                        Anh thực chất chính là một siêu anh hùng luôn tìm kiếm cho mình một đối thủ mạnh.
                        Vấn đề là, cứ mỗi lần bắt gặp một đối thủ tiềm năng, thì đối thủ nào cũng như đối thủ nào, chỉ ăn một đấm của anh là… chết luôn.
                        Liệu rằng Onepunch-Man Saitaman có thể tìm được cho mình một kẻ ác dữ dằn đủ sức đấu với anh? Hãy theo bước Saitama trên con đường một đấm tìm đối cực kỳ hài hước của anh!!
                    </Text>
                ) : (
                    // Nội dung ngắn gọn có thể cuộn
                    <ScrollView style={styles.shortContent}>
                        <Text style={styles.content} numberOfLines={3}>
                            Onepunch-Man là một Manga thể loại siêu anh hùng với đặc trưng phồng tôm đấm phát chết luôn… Lol!!!
                            Nhân vật chính trong Onepunch-man là Saitama, một con người mà nhìn đâu cũng thấy “tầm thường”, từ khuôn mặt vô hồn, cái đầu trọc lóc, cho tới thể hình long tong.
                            Tuy nhiên, con người nhìn thì tầm thường này lại chuyên giải quyết những vấn đề hết sức bất thường.
                            Anh thực chất chính là một siêu anh hùng luôn tìm kiếm cho mình một đối thủ mạnh.
                            Vấn đề là, cứ mỗi lần bắt gặp một đối thủ tiềm năng, thì đối thủ nào cũng như đối thủ nào, chỉ ăn một đấm của anh là… chết luôn.
                            Liệu rằng Onepunch-Man Saitaman có thể tìm được cho mình một kẻ ác dữ dằn đủ sức đấu với anh? Hãy theo bước Saitama trên con đường một đấm tìm đối cực kỳ hài hước của anh!!
                        </Text>
                    </ScrollView>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => { handleOpenIntroduction() }} style={styles.button}>

                    {
                        isOpen ? <Text style={{ color: 'white' }}>
                            Rút gọn
                        </Text> :
                            <Text style={{ color: 'white' }}>
                                Xem thêm
                            </Text>
                    }

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Introduction

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 25,
        display: "flex"
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 20
    },
    contentContainer: {
        marginBottom: 5,
    },
    content: {
        fontSize: 16,
        lineHeight: 20,
    },
    shortContent: {
        maxHeight: 70,
        overflow: 'hidden',
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: 'center',
        width: "auto",
        height: 40,
        backgroundColor: "#fba026",
        borderRadius: 5,
        marginHorizontal: 130,
    },
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
})