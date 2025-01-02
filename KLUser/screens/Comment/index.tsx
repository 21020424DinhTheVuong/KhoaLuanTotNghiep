import React, { useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ButtonBack from '../../common/ButtonBack'
import { COLORS } from '../../hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import ReplyComment from './ReplyComment'


const comments = Array.from({ length: 20 }, (_, index) => ({
    avatar: require("../../assets/avatar.png"),
    name: "Antony Lore",
    time: "2 ngay truoc",
    content: "Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.",
    like: 345,
    dislike: 4543,
}))
const { width, height } = Dimensions.get("window")
const Comment = () => {
    const [text, onChangeText] = useState('')
    const [showTextInput, setShowTextInput] = useState<any>({})
    const handleShowTextInput = (index: any) => {
        setShowTextInput((prev: any) => ({
            ...prev,
            [index]: !prev[index], // Toggle the visibility for the selected comment
        }));
    };
    const [showReplies, setShowReplies] = useState<any>({});

    const handleShowReply = (index: any) => {
        setShowReplies((prev: any) => ({
            ...prev,
            [index]: !prev[index], // Toggle the visibility for the selected comment
        }));
    };
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <ButtonBack />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {comments.map((item, index) => (
                    <View style={styles.commentContainer} key={index}>

                        <Image source={item.avatar} style={styles.avatar} />

                        <View style={styles.contentComment}>
                            <View style={styles.nameUser}>

                                <Text style={{ fontWeight: 600 }}>{item.name}</Text>
                                <Text>{item.time}</Text>
                            </View>

                            <View>
                                <TouchableOpacity >
                                    <Text numberOfLines={4}>{item.content} </Text>
                                </TouchableOpacity>

                            </View>

                            <View style={styles.replyContainer}>
                                <TouchableOpacity>
                                    <Text>
                                        <Ionicons name='thumbs-up' />
                                        {item.like}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text>
                                        <Ionicons name='thumbs-down' />
                                        {item.dislike}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { handleShowTextInput(index) }}>
                                    <Text style={{ textTransform: "uppercase", fontWeight: 600, color: "aqua" }}>
                                        Trả lời
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {
                                showTextInput[index] &&
                                <View>
                                    <TextInput
                                        editable
                                        multiline
                                        numberOfLines={4}
                                        maxLength={100}
                                        onChangeText={text => onChangeText(text)}
                                        value={text}
                                        // style={styles.input}
                                        placeholder='Nhập bình luận của bạn tại đây...'
                                    />
                                </View>
                            }


                            <View style={styles.viewReplies}>
                                <TouchableOpacity
                                    onPress={() => { handleShowReply(index) }}
                                    style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                    <Text style={{ fontWeight: 600 }}>Xem tất cả bình luận</Text>
                                    <Ionicons name="chevron-down" />
                                </TouchableOpacity>
                            </View>

                            {showReplies[index] && (
                                <View>
                                    <ReplyComment />
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

        </View>
    )
}

export default Comment;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
        rowGap: 10,
        marginBottom: 60,
    },
    titleContainer: {
        // marginBottom: 10
    },
    commentContainer: {
        // backgroundColor: "gray",
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 100,
        borderWidth: 1
    },
    contentComment: {
        backgroundColor: COLORS.gray2,
        width: width * 0.78,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    nameUser: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5
        // columnGap: 10
    },
    replyContainer: {
        marginVertical: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        columnGap: 20
    },
    viewReplies: {
        width: "50%"
    }
})