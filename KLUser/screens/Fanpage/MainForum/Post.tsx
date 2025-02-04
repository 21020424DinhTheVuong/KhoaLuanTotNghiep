import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useState, useMemo } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import Modal from "react-native-modal"
import ReasonReport from './ReasonReport'
import { baseURL, formatTimeAgo } from '../../../constants'
import VideoCustom from './Video'
import apiClient from '../../../hooks/ApiRequest/apiClient'

type PostInterface = {
    id: number;
    content_text: string;
    content_image: string | null;
    like_post: number;
    create_at: string;
    update_at: string;
    total_reply_post: number;
    user: { id: number; display_name: string; avatar: string | null };
}
type Props = {
    reportType: string;
    data: PostInterface;
    action: () => void;
    refreshAfterDelete: () => void
}

const Post = ({ reportType, data, action, refreshAfterDelete }: Props) => {
    const navigation = useNavigation<any>()
    const [visibleModal, setVisibleModal] = useState(false);

    const handleShowReportModal = () => {
        setVisibleModal(!visibleModal)
    }
    const mediaItems = useMemo(() => data.content_image?.split(",") || [], [data.content_image]);


    // console.log(data.content_image?.split(","))
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                {
                    data.user.avatar ?
                        <Image source={{ uri: `${baseURL}/${data.user.avatar}` }} style={styles.avatar} />
                        :
                        <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                }
            </View>

            {/* <TouchableOpacity> */}
            <View style={styles.postContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate("ReplyPost", { postId: data.id }) }}>
                    <View style={styles.usernameContainer}>
                        <Text style={{ fontSize: 17, fontWeight: 700 }}>{data.user.display_name}</Text>

                        <View style={styles.actionPost}>
                            <Text style={{ color: "gray", fontSize: 14 }}>{formatTimeAgo(data.update_at)}</Text>
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
                                            <ReasonReport reportType={reportType}
                                                postId={data.id}
                                                reportedId={data.user.id}
                                                refresh={() => { refreshAfterDelete() }}
                                                onCloseReportModal={() => setVisibleModal(false)}
                                                data={{ id: data.id, content: data.content_text, content_image: data.content_image }} />

                                        </TouchableOpacity>

                                    </Modal>
                                )
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate("ReplyPost", { postId: data.id }) }}>

                    <View style={styles.contentContainer}>
                        <Text>{data.content_text}</Text>
                    </View>
                </TouchableOpacity>

                {
                    data.content_image && (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={styles.scrollContent}
                        // style={styles.scrollView}>
                        >
                            {mediaItems.map((item, index) => {
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
                    <TouchableOpacity style={styles.likeAndComment} onPress={action}>
                        <Ionicons name='heart-outline' size={18} color={"red"} />
                        <Text>{data.like_post}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.likeAndComment} onPress={() => { navigation.navigate("ReplyPost", { postId: data.id }) }}>
                        <Ionicons name='chatbubble-outline' size={18} color={"red"} />
                        <Text>{data.total_reply_post}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* </TouchableOpacity> */}

        </View>
    )
}

export default Post

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
        paddingRight: 50,
        // marginRight: 20,
        width: "100%"
    },
    postContainer: {
        // marginRight: 20
        rowGap: 5
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
    scrollContent: {
        flexDirection: 'row', // Ensure images are arranged horizontally
        alignItems: 'center',
    },
})