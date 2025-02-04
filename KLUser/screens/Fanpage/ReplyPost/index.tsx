import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, Dimensions,
    KeyboardAvoidingView, Platform, Keyboard, Alert, ActivityIndicator
} from 'react-native'
import ButtonBack from '../../../common/ButtonBack'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Ionicons } from '@expo/vector-icons'
import ImageSelected from '../UserPost/ImageSelected'
import * as ImagePicker from "expo-image-picker"
import Reply from './Reply'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import apiClient from '../../../hooks/ApiRequest/apiClient'
import { baseURL, formatTimeAgo } from '../../../constants'
import { useAuth } from '../../../hooks/Auth/authContext'
import VideoCustom from '../MainForum/Video'

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
type PostInterface = {
    id: number;
    content_text: string;
    content_image: string | null;
    like_post: number;
    create_at: string;
    update_at: string;
    total_reply_post: number;
    user: { id: number; display_name: string; avatar: string };
    replies: ReplyPostInterface[]
}

const { width, height } = Dimensions.get("window")
const ReplyPost = () => {
    const navigation = useNavigation<any>()
    const { user } = useAuth()
    const route = useRoute<any>()
    const postId = route.params.postId;
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
    const [dataPost, setDataPost] = useState<PostInterface>()
    const mediaItems = useMemo(() => dataPost?.content_image?.split(",") || [], [dataPost?.content_image]);
    const getPostInfor = async () => {
        try {
            const response = await apiClient.get(`posts/${postId}`);
            setDataPost(response.data)
        } catch (error) {
            Alert.alert(
                "Bài viết đã bị xóa hoặc không tồn tại!",
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
    //     getPostInfor()
    // }, [])

    useFocusEffect(
        useCallback(() => {
            getPostInfor(); // Fetch fresh data when this screen is focused
        }, [])
    );
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
    const [selectedImages, setSelectedImages] = useState<any[]>([]); // nếu người dùng muốn trả lời mà có chứa ảnh

    const selectImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'], // Allow images only
            // allowsEditing: true, // Editing disabled for multi-image selection
            quality: 1, // High quality
            allowsMultipleSelection: true,
            selectionLimit: 5, // Allow unlimited selection
        });

        if (!result.canceled) {
            const mediaData = result.assets.map((media: any) => ({
                uri: media.uri,
                type: media.mimeType,
                name: `${user?.id}`,
            }));

            setSelectedImages(mediaData);
        }

    };

    const uploadReplyPost = async () => {
        setLoading(true)

        const formData = new FormData();
        formData.append('userId', String(user?.id));
        // formData.append("postId", String(postId));
        formData.append('content', textReply.trim());
        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((media) => {
                formData.append('reply_post', {
                    uri: media.uri,
                    name: `${media.name}.${media.uri.split('.').pop()}`, // Dynamic file name based on uri
                    type: media.type, // e.g., 'image/jpeg' or 'video/mp4'
                } as any);
            });
        }

        try {
            const response = await apiClient.post(`posts/add-reply-post/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Alert.alert(
                'Thành công',
                'Bình luận thành công!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setTextReply('');
                            setSelectedImages([]);
                            getPostInfor()
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

    const likePost = async (postId: any) => {
        try {
            await apiClient.patch(`posts/like-post/${postId}`);
            getPostInfor()
        } catch (error) {

        }
    }
    const likeReplyPost = async (replyPostId: any) => {
        try {
            await apiClient.patch(`posts/like-reply-post/${replyPostId}`)
            getPostInfor()
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
                                dataPost?.user.avatar ?
                                    <Image source={{ uri: `${baseURL}/${dataPost.user.avatar}` }} style={styles.avatar} />
                                    :
                                    <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                            }
                            <TouchableOpacity onPress={() => { navigation.navigate(user?.id === dataPost?.user.id ? "MyPost" : "UserProfile") }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 600
                                }}>{dataPost?.user.display_name}</Text>
                            </TouchableOpacity>

                            <Text>{formatTimeAgo(dataPost?.update_at || "")}</Text>
                        </View>

                        <View>
                            <Text>
                                {dataPost?.content_text}
                            </Text>

                            {
                                dataPost?.content_image ?
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
                                        imageUrls={dataPost?.content_image?.split(",").map((uri) => ({ url: `${baseURL}/${uri}` }))}
                                        index={selectedImageIndex} // Display the selected image based on the index
                                        onSwipeDown={closeImageViewer} // Close the modal when swiped down
                                        enableImageZoom={true} // Enable pinch-to-zoom functionality
                                        // renderIndicator={() => null} // Optional: Hide the indicator
                                        backgroundColor="black" // Background color for the modal
                                    />
                                </Modal>
                            )}

                            <View style={styles.likeAndCommentContainer}>
                                <TouchableOpacity style={styles.likeAndComment}
                                    onPress={() => { likePost(dataPost?.id) }}>
                                    <Ionicons name='heart-outline' size={18} color={"red"} />
                                    <Text>{dataPost?.like_post}</Text>
                                </TouchableOpacity>
                                <View style={styles.likeAndComment}>
                                    <Ionicons name='chatbubble-outline' size={18} color={"red"} />
                                    <Text>{dataPost?.total_reply_post}</Text>
                                </View>
                            </View>

                            <View style={{ borderBottomWidth: 0.5, paddingVertical: 10, }}>
                                <Text style={{ fontSize: 16, fontWeight: 600, marginLeft: 10 }}>Phản hồi</Text>
                            </View>

                        </View>

                    </View>

                    <View style={{ marginBottom: 60 }}>
                        {
                            dataPost?.replies.map((item, index) => (
                                <Reply key={index} reply={item}
                                    action={() => { likeReplyPost(item.id) }}
                                    refreshAfterDelete={() => { getPostInfor() }} />
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

                        <TouchableOpacity style={{ marginRight: 5, marginLeft: ((textReply !== '') ? 0 : 20) }} onPress={() => { selectImages() }}>
                            <Ionicons name='images-outline' size={18} color={"white"} />

                        </TouchableOpacity>
                        {
                            (textReply.trim() !== '') ?
                                <TouchableOpacity onPress={() => { uploadReplyPost() }}
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

                    {selectedImages.length > 0 ? (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={styles.scrollContent}
                        // style={styles.scrollView}>
                        >
                            {selectedImages.map((item, index) => (
                                <ImageSelected imageUrl={item.uri} action={() => {
                                    setSelectedImages((prevImages) =>
                                        prevImages.filter((_, i) => i !== index)
                                    );
                                }}
                                    key={index} />
                            ))}
                        </ScrollView>
                    ) : (
                        null
                    )}
                </View>
            </KeyboardAvoidingView>

        </View>
    )
}

export default ReplyPost

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
        columnGap: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
        // backgroundColor: "white",
        width: "75%",
        minHeight: 50,
        color: "white"
    }
})