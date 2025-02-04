import { useState, useEffect, useMemo, useCallback } from "react";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native"
import { View, Text, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, TextInput, Modal, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native"
import apiClient from "../../../hooks/ApiRequest/apiClient";
import { useAuth } from "../../../hooks/Auth/authContext";
import ButtonBack from "../../../common/ButtonBack";
import { baseURL, formatTimeAgo } from "../../../constants";
import { Ionicons } from "@expo/vector-icons";
import VideoCustom from "../MainForum/Video";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from 'react-native-image-zoom-viewer'
import ReplyChildren from "./ReplyChildren";

type ReplyPostChildrenInterface = {
    id: number;
    content_reply_post_children: string;
    // content_reply_post_image: string;
    like_post: number;
    create_at: string;
    update_at: string;
    user: { id: number; display_name: string; avatar: string };
    // total_reply_post_children: number
}
type ReplyPostInterface = {
    id: number;
    content_reply_post: string;
    content_reply_post_image: string;
    like_post: number;
    create_at: string;
    update_at: string;
    total_reply_post_children: number;
    user: { id: number; display_name: string; avatar: string };
    children: ReplyPostChildrenInterface[]
}
const { height, width } = Dimensions.get("window")
const ReplyPostChildren = () => {
    const navigation = useNavigation<any>()
    const { user } = useAuth()
    const route = useRoute<any>()
    const replyId = route.params.replyId;
    // console.log(replyId)
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);
    const [dataReplyPost, setDataReplyPost] = useState<ReplyPostInterface>()
    const mediaItems = useMemo(() => dataReplyPost?.content_reply_post_image?.split(",") || [], [dataReplyPost?.content_reply_post_image]);
    const getReplyPostInfor = async () => {
        try {
            const response = await apiClient.get(`posts/reply-post/${replyId}`);
            setDataReplyPost(response.data)
        } catch (error) {
            Alert.alert(
                "Bình luận đã bị xóa hoặc không tồn tại!",
                'Nhấn OK để trở về.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack()
                        },
                    },
                ],
            );
        }
    }
    // useEffect(() => {
    //     getReplyPostInfor()
    // }, [])
    // console.log(route)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openImageViewer = (index: number) => {
        setSelectedImageIndex(index); // Set the selected image index for full-screen view
        setIsModalVisible(true); // Open the modal
    };

    const closeImageViewer = () => {
        setIsModalVisible(false); // Close the modal
    };

    const [textReply, setTextReply] = useState<string>('')

    const uploadReplyPostChildren = async () => {
        setLoading(true)

        const formData = new FormData();
        formData.append('userId', String(user?.id));
        // formData.append("postId", String(postId));
        formData.append('content', textReply.trim());

        try {
            await apiClient.post(`posts/add-reply-post-children/${replyId}`, {
                userId: Number(user?.id),
                content: String(textReply.trim())
            });
            Alert.alert(
                'Thành công',
                'Bình luận thành công!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setTextReply('');
                            getReplyPostInfor()
                        },
                    },
                ],
            );

        } catch (error) {
            Alert.alert('Lỗi', 'Phản hồi không thành công!');
            console.log(error)
        } finally {
            setLoading(false);
        }
    };
    useFocusEffect(
        useCallback(() => {
            getReplyPostInfor(); // Fetch fresh data when this screen is focused
        }, [])
    );

    const likeReplyPost = async () => {
        try {
            await apiClient.patch(`posts/like-reply-post/${replyId}`)
            getReplyPostInfor()
        } catch (error) {

        }
    }
    const likeReplyPostChildren = async (replyPostChildrenId: any) => {
        try {
            await apiClient.patch(`posts/like-reply-post-children/${replyPostChildrenId}`)
            getReplyPostInfor()
        } catch (error) {

        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonBack}>
                <ButtonBack />
                <Text style={{ fontSize: 17 }}>Trở về</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}>

                    <View>
                        <View style={styles.avatarContainer}>
                            {
                                dataReplyPost?.user.avatar ?
                                    <Image source={{ uri: `${baseURL}/${dataReplyPost?.user.avatar}` }} style={styles.avatar} />
                                    :
                                    <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                            }
                            <TouchableOpacity onPress={() => { navigation.navigate(user?.id === dataReplyPost?.user.id ? "MyPost" : "UserProfile") }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 600
                                }}>{dataReplyPost?.user.display_name}</Text>
                            </TouchableOpacity>

                            <Text>{formatTimeAgo(dataReplyPost?.update_at || "")}</Text>
                        </View>

                        <View>
                            <Text>
                                {dataReplyPost?.content_reply_post}
                            </Text>

                            {
                                dataReplyPost?.content_reply_post_image ?
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
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => { openImageViewer(index) }}>

                                                    <VideoCustom videoUri={uri}
                                                        action={() => { }}
                                                        canDelete={false} />
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => { openImageViewer(index) }}>
                                                    <Image
                                                        source={{ uri }}
                                                        style={{ height: 250, width: 250, borderRadius: 10, marginRight: 5 }}
                                                    />
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                    :
                                    null
                            }

                            {isModalVisible && (
                                <Modal
                                    visible={isModalVisible}
                                    transparent={true}
                                    onRequestClose={closeImageViewer}
                                    animationType="fade"
                                >
                                    <TouchableOpacity onPress={() => { closeImageViewer() }} style={{ position: 'absolute', right: 20, top: 20, zIndex: 99 }}>
                                        <Ionicons name="close" size={30} color={"white"} />
                                    </TouchableOpacity>
                                    <ImageViewer
                                        imageUrls={dataReplyPost?.content_reply_post_image?.split(",").map((uri) => ({ url: `${baseURL}/${uri}` }))}
                                        index={selectedImageIndex} // Display the selected image based on the index
                                        onSwipeDown={closeImageViewer} // Close the modal when swiped down
                                        enableImageZoom={true} // Enable pinch-to-zoom functionality
                                        // renderIndicator={() => null} // Optional: Hide the indicator
                                        backgroundColor="black" // Background color for the modal
                                    />
                                </Modal>
                            )}

                            <View style={styles.likeAndCommentContainer}>
                                <TouchableOpacity style={styles.likeAndComment} onPress={likeReplyPost}>
                                    <Ionicons name='heart-outline' size={18} color={"red"} />
                                    <Text>{dataReplyPost?.like_post}</Text>
                                </TouchableOpacity>
                                <View style={styles.likeAndComment}>
                                    <Ionicons name='chatbubble-outline' size={18} color={"red"} />
                                    <Text>{dataReplyPost?.total_reply_post_children}</Text>
                                </View>
                            </View>

                            <View style={{ borderBottomWidth: 0.5, paddingVertical: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: 600, marginLeft: 10 }}>Phản hồi</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: 60 }}>
                        {
                            dataReplyPost?.children.map((item, index) => (
                                <ReplyChildren key={index} children={item}
                                    action={() => { likeReplyPostChildren(item.id) }}
                                    refreshAfterDelete={getReplyPostInfor} />
                            ))
                        }
                    </View>
                </ScrollView>

                {/*Nhập phần trả lời cho Post */}
                <View style={[styles.inputReplyContainer, { bottom: isKeyboardVisible ? 40 : 20 }]}>
                    <View style={styles.inputReply}>
                        {
                            user?.avatar ?
                                <Image source={{ uri: `${baseURL}/${user.avatar}` }} style={{ width: 30, height: 30, borderRadius: 100 }} />
                                :
                                <Image source={require("../../../assets/avatar.png")} style={{ width: 30, height: 30, borderRadius: 100 }} />
                        }

                        <TextInput
                            style={styles.input}
                            placeholder='Trả lời...'
                            value={textReply}
                            onChangeText={setTextReply}
                            placeholderTextColor={"white"}
                            multiline
                            numberOfLines={5}
                        />

                        {
                            (textReply.trim() !== '') ?
                                <TouchableOpacity onPress={() => { uploadReplyPostChildren(); console.log(textReply) }}
                                    disabled={loading}>
                                    {
                                        loading ?
                                            <ActivityIndicator size={18} color={"white"} />
                                            :
                                            <Ionicons name='paper-plane' size={18} color={"white"} />
                                    }
                                </TouchableOpacity>
                                : null
                        }
                    </View>

                </View>
            </KeyboardAvoidingView>

        </View>
    )
}

export default ReplyPostChildren

const styles = StyleSheet.create({
    container: {
        minHeight: height,
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    buttonBack: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // marginBottom: 20,
        borderBottomWidth: 0.3,
        borderBottomColor: "gray",
        paddingBottom: 10
    },
    avatarContainer: {
        marginTop: 10,
        display: 'flex',
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    avatar: {
        height: 45,
        width: 45,
        borderWidth: 0.5,
        borderRadius: 100
    },
    scrollContent: {
        flexDirection: 'row', // Ensure images are arranged horizontally
        alignItems: 'center',
    },
    likeAndComment: {
        display: "flex",
        flexDirection: "row",
        columnGap: 5
    },
    likeAndCommentContainer: {
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        marginTop: 10,
        borderBottomWidth: 0.5,
        paddingBottom: 10,
    },

    inputReplyContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        position: "absolute",
        left: 0,
        // bottom: 40,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "grey",
        alignItems: "center",
        borderRadius: 15,
        width: width * 0.9,
        opacity: 0.7
    },
    inputReply: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
        // backgroundColor: "white",
        width: "80%",
        minHeight: 50,
        color: "white"
    }
})


