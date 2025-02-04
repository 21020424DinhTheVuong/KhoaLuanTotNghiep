import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import Modal from "react-native-modal"
import ReasonReport from '../MainForum/ReasonReport'
import { baseURL, formatTimeAgo } from '../../../constants'
import { useAuth } from '../../../hooks/Auth/authContext'
import VideoCustom from '../MainForum/Video'
import apiClient from '../../../hooks/ApiRequest/apiClient'
type ReplyPostInterface = {
    id: number;
    content_reply_post: string;
    content_reply_post_image: string;
    like_post: number;
    create_at: string;
    update_at: string;
    user: { id: number; display_name: string; avatar: string };
    total_reply_post_children: number
}
type ReplyInterface = {
    reply: ReplyPostInterface;
    action: () => void;
    refreshAfterDelete: () => void
}

const Reply = ({ reply, action, refreshAfterDelete }: ReplyInterface) => {
    const { user } = useAuth()
    const navigation = useNavigation<any>()
    const [visibleModal, setVisibleModal] = useState(false);

    const handleShowReportModal = () => {
        setVisibleModal(!visibleModal)
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                {
                    reply.user.avatar ?
                        <Image source={{ uri: `${baseURL}/${reply.user.avatar}` }} style={styles.avatar} />
                        :
                        <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                }
            </View>

            <View style={styles.postContainer}>
                <View style={styles.usernameContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate("ReplyPostChildren", { replyId: reply.id }) }}>

                        <Text style={{ fontSize: 17, fontWeight: 700 }}>{reply.user.display_name}</Text>
                    </TouchableOpacity>
                    <View style={styles.actionPost}>
                        <Text style={{ color: "gray", fontSize: 14 }}>{formatTimeAgo(reply.update_at)}</Text>
                        <TouchableOpacity onPress={() => { setVisibleModal(true) }}>
                            <Ionicons name='ellipsis-horizontal' size={18} />
                        </TouchableOpacity>
                        {
                            visibleModal && (
                                <Modal
                                    isVisible={visibleModal}
                                    onBackdropPress={handleShowReportModal} // Closes the modal when tapping outside
                                    animationIn='zoomIn' // Custom animation for opening
                                    animationOut='zoomOut'
                                >
                                    <TouchableOpacity onPress={() => { handleShowReportModal() }}>
                                        <ReasonReport reportType={user?.id === reply.user.id ? "userReply" : "report"}
                                            replyPostId={reply.id}
                                            reportedId={reply.user.id}
                                            refresh={() => { refreshAfterDelete() }}
                                            onCloseReportModal={() => { setVisibleModal(false) }}
                                            data={{ id: reply.id, content: reply.content_reply_post, content_image: reply.content_reply_post_image }} />
                                    </TouchableOpacity>

                                </Modal>
                            )
                        }
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate("ReplyPostChildren", { replyId: reply.id }) }}>

                        <Text>{reply.content_reply_post}</Text>
                    </TouchableOpacity>
                </View>
                {
                    reply.content_reply_post_image && (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={styles.scrollContent}
                        // style={styles.scrollView}>
                        >
                            {reply.content_reply_post_image.split(",").map((item, index) => {
                                const uri = `${baseURL}/${item}`;
                                const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(item);

                                return isVideo ? (
                                    <VideoCustom key={index} videoUri={uri}
                                        action={() => { }}
                                        canDelete={false} />
                                ) : (
                                    <Image
                                        key={index}
                                        source={{ uri }}
                                        style={{ height: 250, width: 250, borderRadius: 10, marginRight: 5 }}
                                    />
                                );
                            })}
                        </ScrollView>
                    )
                }
                <View style={styles.likeAndCommentContainer}>
                    <TouchableOpacity style={styles.likeAndComment} onPress={() => { action() }}>
                        <Ionicons name='heart-outline' size={18} color={"red"} />
                        <Text>{reply.like_post}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.likeAndComment} onPress={() => { navigation.navigate("ReplyPostChildren", { replyId: reply.id }) }}>
                        <Ionicons name='chatbubble-outline' size={18} color={"red"} />
                        <Text>{reply.total_reply_post_children}</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default Reply

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        borderBottomWidth: 0.3,
        paddingVertical: 20,
        marginRight: 10
    },
    avatarContainer: {
    },
    avatar: {
        height: 45,
        width: 45,
        borderWidth: 0.5,
        borderRadius: 100
    },
    usernameContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginRight: 20,
        width: "90%"
    },
    postContainer: {
        // marginRight: 20
        rowGap: 5
    },
    scrollContent: {
        flexDirection: 'row', // Ensure images are arranged horizontally
        alignItems: 'center',
    },
    actionPost: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    contentContainer: {
        maxWidth: "90%"
    },
    likeAndComment: {
        display: "flex",
        flexDirection: "row",
        columnGap: 5
    },
    likeAndCommentContainer: {
        display: "flex",
        flexDirection: "row",
        columnGap: 10
    },
    modalPicker: {
        // maxHeight: height * 0.8,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        borderRadius: 5,
        justifyContent: 'space-between',
        padding: 10,
        alignItems: "center"
        // alignItems: "center"
    },
})