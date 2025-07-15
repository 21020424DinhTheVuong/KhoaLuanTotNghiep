import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Button, ScrollView, Modal, Dimensions, Alert, ActivityIndicator } from 'react-native'
import axios from 'axios'
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from '@expo/vector-icons'
import ButtonClose from '../../../common/ButtonClose'
import ImageSelected from './ImageSelected'
import ImageViewer from 'react-native-image-zoom-viewer';
import { Camera, CameraView } from 'expo-camera';
import { CameraType } from 'expo-image-picker'
import VideoCustom from '../MainForum/Video'
import { useAuth } from '../../../hooks/Auth/authContext'
import { baseURL } from '../../../constants'
import apiClient from '../../../hooks/ApiRequest/apiClient'
import { useNavigation, useRoute } from '@react-navigation/native'

type Props = {}
const { height, width } = Dimensions.get("screen")
function UserPost() {
    const { user } = useAuth()
    const route = useRoute<any>();
    // console.log(route);
    const imageUrl = route.params != undefined ? route.params.imageUrl : "";
    // const imageUrl = "";
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation<any>()
    const [contentPost, setContentPost] = useState('')

    const [selectedMedia, setSelectedMedia] = useState<any[]>(imageUrl ? [{ uri: imageUrl, type: "image/jpeg", name: "generate" }] : []);
    // console.log(selectedMedia)
    const selectImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'], // Allow images only
            // allowsEditing: true, // Editing disabled for multi-image selection
            quality: 1, // High quality
            allowsMultipleSelection: true,
            selectionLimit: 5, // Allow unlimited selection
        });

        if (!result.canceled) {
            // const uris = result.assets.map((asset) => asset); // Extract URIs
            const mediaData = result.assets.map((media: any) => ({
                uri: media.uri,
                type: media.mimeType,
                name: `${user?.id}`,
            }));

            setSelectedMedia(mediaData);
            // console.log(selectedMedia)

        }

    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openImageViewer = (index: number) => {
        setSelectedImageIndex(index); // Set the selected image index for full-screen view
        setIsModalVisible(true); // Open the modal
    };

    const closeImageViewer = () => {
        setIsModalVisible(false); // Close the modal
    };

    const [openCamera, setOpenCamera] = useState(false)

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [camera, setCamera] = useState<any>(null);
    const [image, setImage] = useState<any>(null);
    const [type, setType] = useState<any>(CameraType.back)
    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePhoto = async () => {
        if (camera) {
            const photo = await camera.takePictureAsync({
                quality: 1,
                base64: false,
                skipProcessing: false,
                mirrorImage: false,  // Use normal processing
            }); // Correct usage
            setSelectedMedia([{
                uri: photo.uri,
                name: "photo_by_myself",
                type: "image/jpeg"
            }]); // Add the photo URI to selectedImages
            // console.log(photo)
        }
        setTimeout(() => {
            setOpenCamera(false)
        }, 1000);
    };

    if (hasPermission === null) {
        return <Text>Requesting camera permissions...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const uploadPost = async () => {
        setLoading(true)

        const formData = new FormData();
        formData.append('userId', String(user?.id));
        formData.append('content', contentPost);
        // formData.append("postId", String(post))
        if (selectedMedia && selectedMedia.length > 0) {
            selectedMedia.forEach((media) => {
                formData.append('content_media', {
                    uri: media.uri,
                    name: `${media.name}.${media.uri.split('.').pop()}`, // Dynamic file name based on uri
                    type: media.type, // e.g., 'image/jpeg' or 'video/mp4'
                } as any);
            });
        }

        try {
            const response = await apiClient.post('posts/create-post', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Alert.alert(
                'Thành công',
                'Đăng bài thành công! Nhấn OK để trở về.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setContentPost('');
                            setSelectedMedia([]);
                            navigation.goBack()
                        },
                    },
                ],
            );

        } catch (error) {
            Alert.alert('Lỗi', 'Đăng bài không thành công!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.closeButton}>
                <ButtonClose />
                <Text style={{ fontSize: 20 }}>Bài đăng mới</Text>
            </View>

            <View style={styles.contentPostContainer}>
                <View>
                    {
                        user?.avatar ?
                            <Image source={{ uri: `${baseURL}/${user.avatar}` }} style={styles.avatar} />
                            :
                            <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />

                    }
                </View>

                <View>
                    <Text style={{ fontSize: 17, fontWeight: 700 }}>{user?.display_name}</Text>

                    <View>
                        <TextInput
                            style={styles.input}
                            numberOfLines={5}
                            multiline
                            onChangeText={value => setContentPost(value)}
                            value={contentPost}
                            placeholder='Có gì mới...' />
                    </View>
                    {selectedMedia.length > 0 ? (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={styles.scrollContent}
                        // style={styles.scrollView}>
                        >
                            {selectedMedia.map((item, index) => (
                                <View key={index}>
                                    {
                                        item.type === 'video' ?
                                            <VideoCustom key={index} videoUri={item.uri}
                                                action={() => {
                                                    setSelectedMedia((prevImages) =>
                                                        prevImages.filter((_, i) => i !== index)
                                                    );
                                                }}
                                                canDelete={true} />

                                            :
                                            <TouchableOpacity key={index} onPress={() => openImageViewer(index)}>

                                                <ImageSelected imageUrl={item.uri} action={() => {
                                                    setSelectedMedia((prevImages) =>
                                                        prevImages.filter((_, i) => i !== index)
                                                    );
                                                }} />
                                            </TouchableOpacity>
                                    }

                                </View>

                            ))}
                        </ScrollView>
                    ) : (
                        null
                    )}
                    {isModalVisible && (
                        <Modal
                            visible={isModalVisible}
                            transparent={true}
                            onRequestClose={closeImageViewer}
                            animationType="fade"
                        // style={{ height: "90%" }}
                        >
                            <TouchableOpacity onPress={() => { closeImageViewer() }} style={{ position: 'absolute', right: 20, top: 20, zIndex: 99 }}>
                                <Ionicons name="close" size={30} color={"white"} />
                            </TouchableOpacity>
                            <ImageViewer
                                imageUrls={selectedMedia.map((item) => ({ url: item.uri }))}
                                index={selectedImageIndex} // Display the selected image based on the index
                                onSwipeDown={closeImageViewer} // Close the modal when swiped down
                                enableImageZoom={true} // Enable pinch-to-zoom functionality
                                // renderIndicator={() => null} // Optional: Hide the indicator
                                backgroundColor="black" // Background color for the modal
                            />
                        </Modal>
                    )}


                    <View style={styles.actionPost}>
                        <TouchableOpacity onPress={() => { selectImages() }}>
                            <Ionicons name='images-outline' size={22} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setOpenCamera(!openCamera) }}>
                            <Ionicons name='camera-outline' size={22} />
                        </TouchableOpacity>

                    </View>
                </View>



            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                {
                    loading ?
                        <ActivityIndicator size={50} /> : null
                }
            </View>
            <View style={{
                position: "absolute", bottom: 0, backgroundColor: "red", left: "40%",
                padding: 10, borderRadius: 15, paddingHorizontal: 30,
                opacity: contentPost.trim() === "" ? 0.6 : 1
            }}>
                <TouchableOpacity onPress={() => { uploadPost(); }}
                    disabled={contentPost.trim() === "" || loading === true ? true : false}
                >
                    <Text style={{ color: "white", fontSize: 25, fontWeight: 600 }}>Đăng</Text>
                </TouchableOpacity>
            </View>
            {
                openCamera && (
                    <View style={{ flex: 1, flexDirection: "column", height: "100%", width: "100%", position: 'absolute' }}>
                        <CameraView ref={(ref: any) => setCamera(ref)}
                            style={{ flex: 1, aspectRatio: 1, height: height, width: width }}
                            facing={type}

                            ratio="1:1" // Adjust the ratio (common for "normal" photos)
                            autofocus='on'
                        >
                            <TouchableOpacity onPress={() => { takePhoto(); }}
                                style={{ position: "absolute", bottom: 50, left: "20%", zIndex: 99 }}
                            >
                                <Ionicons name='radio-button-on-outline' size={90} color={"white"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setType(type === CameraType.back ? CameraType.front : CameraType.back) }}

                                style={{ position: "absolute", bottom: 70, left: "40%", zIndex: 99, }} >
                                <Ionicons name={type === CameraType.back ? "camera-reverse" : "camera-reverse-outline"} size={40} color={"white"} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { setOpenCamera(false) }}

                                style={{ position: "absolute", top: 20, left: "42%", zIndex: 99, }} >
                                <Ionicons name='close' size={30} color={"white"} />
                            </TouchableOpacity>
                        </CameraView>


                    </View>
                )
            }

        </View >
    )
}

export default UserPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginVertical: 10
    },
    closeButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: "gray",
        paddingBottom: 5
    },
    contentPostContainer: {
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        borderBottomWidth: 0.3,
        paddingVertical: 20,
        width: "90%"
    },
    avatar: {
        height: 45,
        width: 45,
        borderWidth: 0.5,
        borderRadius: 100
    },
    input: {
        maxWidth: 300
    },
    actionPost: {
        display: "flex",
        flexDirection: "row",
        columnGap: 20
    },
    deleteImage: {
        position: "absolute",
        right: -100
    },
    imageList: {

    },
    image: {
        width: 280,
        height: 280
        // width: 200,
        // objectFit: "contain"
    },

    scrollContent: {
        flexDirection: 'row', // Ensure images are arranged horizontally
        alignItems: 'center',
        paddingRight: 25
    },

    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    preview: {
        padding: 10,
        textAlign: 'center',
    },
})