import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../hooks/useTheme'

const comments = Array.from({ length: 5 }, (_, index) => ({
    avatar: require("../../assets/avatar.png"),
    name: "Antony Lore",
    time: "2 ngay truoc",
    content: "Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.",
    like: 345,
    dislike: 4543,
}))
const { width, height } = Dimensions.get("window")
const ReplyComment = () => {
    return (
        <View>
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

                            <TouchableOpacity>
                                <Text style={{ textTransform: "uppercase", fontWeight: 600, color: "aqua" }}>
                                    Trả lời
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default ReplyComment

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
        rowGap: 10,
    },
    titleContainer: {
        // marginBottom: 10
    },
    commentContainer: {
        // backgroundColor: "gray",
        // borderBottomWidth: 1,
        borderTopWidth: 1,
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        paddingVertical: 5
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 100,
        borderWidth: 1
    },
    contentComment: {
        backgroundColor: COLORS.gray2,
        width: width * 0.6,
        borderRadius: 5,
        paddingLeft: 10
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