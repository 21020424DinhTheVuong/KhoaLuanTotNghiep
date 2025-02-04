import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'

type BookIntroDuction = {
    introduction: any
}
const Introduction = ({ introduction }: BookIntroDuction) => {
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
                        {introduction}
                    </Text>
                ) : (
                    // Nội dung ngắn gọn có thể cuộn
                    <ScrollView style={styles.shortContent}>
                        <Text style={styles.content} numberOfLines={3}>
                            {introduction}
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