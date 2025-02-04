import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ButtonBack from '../../common/ButtonBack'
import { COLORS } from '../../hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import ReplyComment from './ReplyComment'
import { useAuth } from '../../hooks/Auth/authContext'
import apiClient from '../../hooks/ApiRequest/apiClient'
import { useRoute } from '@react-navigation/native'
import { baseURL, formatTimeAgo } from '../../constants'
import { formatDistance } from 'date-fns'

type CommentInterface = {
    id: number;
    content: string;
    user: { display_name: string, avatar: string };
    create_at: string;
    timeAgo?: string;
    like: number;
    total_reply: number;
    replies: ReplyInterface[];
}

type ReplyInterface = {
    id: number;
    content: string;
    user: { display_name: string, avatar: string };
    like: number;
    // total_comment: number;
    create_at: string;
    timeAgo?: string
}

const { width, height } = Dimensions.get("window")
const Comment = () => {
    const { user } = useAuth()
    const route = useRoute<any>();
    const bookId = route.params.bookId;
    const [replyTexts, setReplyTexts] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(false)
    const [loadingReplies, setLoadingReplies] = useState<{ [key: number]: boolean }>({});
    const onChangeText = (text: string, id: number) => {
        setReplyTexts((prev) => ({
            ...prev,
            [id]: text,  // Update only the specific comment's text
        }));
    };
    const [showReplies, setShowReplies] = useState<any>({});

    const handleShowReply = (index: any) => {
        setShowReplies((prev: any) => ({
            ...prev,
            [index]: !prev[index], // Toggle the visibility for the selected comment
        }));
    };

    const [dataComment, setDataComment] = useState<CommentInterface[]>([])
    const getCommentBook = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get(`comment/${bookId}`);
            setDataComment(response.data)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCommentBook()
    }, [])

    const handleLikeReply = async (replyId: number) => {
        try {
            await apiClient.patch(`comment/${replyId}/likeReply`);
            const response = await apiClient.get(`comment/${bookId}`);
            setDataComment(response.data)
        } catch (error) {

        }
    };
    const likeComment = async (index: any) => {
        try {
            await apiClient.patch(`comment/${index}/like`);
            const response = await apiClient.get(`comment/${bookId}`);
            setDataComment(response.data)
        } catch (error) {

        }
    }

    const addReply = async (commentId: number) => {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
        if (!replyTexts[commentId]) return;
        try {
            await apiClient.post(`comment/reply/${user?.id}`, {
                comment_id: commentId,
                content: replyTexts[commentId]
            })
        } catch (error) {

        } finally {
            getCommentBook();
            setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
            onChangeText("", commentId)
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <ButtonBack />
            </View>
            {
                loading ?
                    <ActivityIndicator size={50} />
                    :
                    <View>

                        {
                            dataComment.length > 0 ?
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {dataComment.map((item, index) => (
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
                                                    <TouchableOpacity onPress={() => { likeComment(item.id) }}
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row", alignItems: "center"
                                                        }}>
                                                        <Ionicons name='heart' color={"red"} size={16} />

                                                        <Text style={{ fontSize: 16 }}>
                                                            {item.like}
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity onPress={() => { addReply(item.id) }}
                                                        disabled={!replyTexts[item.id]?.trim()} // Disable if empty
                                                    >
                                                        {
                                                            loadingReplies[item.id] ?
                                                                <ActivityIndicator size={14} />
                                                                :
                                                                <Text style={{ textTransform: "uppercase", fontWeight: 600, color: "red", opacity: replyTexts[item.id] ? 1 : 0.5 }}>
                                                                    Trả lời
                                                                </Text>
                                                        }

                                                    </TouchableOpacity>

                                                </View>

                                                <View>
                                                    <TextInput
                                                        editable
                                                        multiline
                                                        numberOfLines={4}
                                                        maxLength={100}
                                                        onChangeText={(text) => onChangeText(text, item.id)}
                                                        value={replyTexts[item.id] || ''} // Get value for this comment
                                                        // style={styles.input}
                                                        placeholder='Nhập bình luận của bạn tại đây...'
                                                    />
                                                </View>
                                                {/* } */}


                                                {item.total_reply > 0 ?
                                                    <View style={styles.viewReplies}>
                                                        <TouchableOpacity
                                                            onPress={() => { handleShowReply(index) }}
                                                            style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                            <Text style={{ fontWeight: 600 }}>Xem tất cả bình luận</Text>
                                                            <Ionicons name="chevron-down" />
                                                        </TouchableOpacity>
                                                    </View>
                                                    :
                                                    null}
                                                {showReplies[index] && (
                                                    <View>
                                                        <ReplyComment replies={item.replies}
                                                            onLikeReply={(replyId) => handleLikeReply(replyId)} />
                                                    </View>
                                                )}

                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                                :
                                <Text style={{ fontSize: 20, textAlign: "center" }}>Không có bình luận.</Text>
                        }
                    </View>
            }
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