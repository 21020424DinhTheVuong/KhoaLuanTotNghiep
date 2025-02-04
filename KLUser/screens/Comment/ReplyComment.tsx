import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../hooks/useTheme'
import { baseURL, formatTimeAgo } from '../../constants'
import apiClient from '../../hooks/ApiRequest/apiClient'

const comments = Array.from({ length: 5 }, (_, index) => ({
    avatar: require("../../assets/avatar.png"),
    name: "Antony Lore",
    time: "2 ngay truoc",
    content: "Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay. Bo truyen nay rat hay.",
    like: 345,
    dislike: 4543,
}))

type ReplyInterface = {
    id: number;
    content: string;
    user: { display_name: string, avatar: string };
    like: number;
    // total_comment: number;
    create_at: string;
    timeAgo?: string
}
type ReplyData = {
    replies: ReplyInterface[],
    onLikeReply: (replyId: number) => void; // Ensure it expects two arguments
}
const { width, height } = Dimensions.get("window")
const ReplyComment = ({ replies, onLikeReply }: ReplyData) => {
    return (
        <View>
            {replies.map((item, index) => (
                <View style={styles.commentContainer} key={index}>
                    {
                        item.user.avatar ?
                            <Image source={{ uri: `${baseURL}/${item.user.avatar}` }} style={styles.avatar} />
                            :
                            <Image source={require("../../assets/avatar.png")} style={styles.avatar} />
                    }

                    <View style={styles.contentComment}>
                        <View style={styles.nameUser}>

                            <Text style={{ fontWeight: 600 }}>{item.user.display_name}</Text>
                            <Text>{formatTimeAgo(item.create_at)}</Text>
                        </View>

                        <View>
                            <TouchableOpacity >
                                <Text numberOfLines={4}>{item.content} </Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.replyContainer}>
                            <TouchableOpacity onPress={() => onLikeReply(item.id)}>
                                <Ionicons name='heart' color={"red"} size={16} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 16 }}>
                                {item.like}
                            </Text>

                            {/* <TouchableOpacity>
                                <Text style={{ textTransform: "uppercase", fontWeight: 600, color: "red" }}>
                                    Trả lời
                                </Text>
                            </TouchableOpacity> */}
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
        alignItems: "center"
        // justifyContent: "flex-start",
        // columnGap: 20
    },
    viewReplies: {
        width: "50%"
    }
})