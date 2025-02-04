import React, { useState, useRef, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Button, ScrollView, Modal, Dimensions } from 'react-native'
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from '@expo/vector-icons'
import ButtonClose from '../../../common/ButtonClose'
import ImageSelected from '../../Fanpage/UserPost/ImageSelected'
import ImageViewer from 'react-native-image-zoom-viewer';
import { Camera, CameraView } from 'expo-camera';
import { CameraType } from 'expo-image-picker';
import VideoCustom from '../../Fanpage/MainForum/Video'

type Props = {}
const localSource = require('../../../assets/video.mp4')
const { height, width } = Dimensions.get("screen")
function EditPost() {
    const [contentPost, setContentPost] = useState('CHuc mung, chuc mung chung ckajsdhl,sdasj klasjlkdskl,askjdl kalsjdas j')

    const [selectedMedia, setSelectedMedia] = useState<any[]>([]);

    const selectImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'], // Allow both images and videos
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: 5, // Limit selection to 5
        });

        if (!result.canceled && result.assets) {
            // console.log(result.assets)

            setSelectedMedia(result.assets);
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
            setSelectedMedia([photo.uri]); // Add the photo URI to selectedMedia
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

    return (
        <View style={styles.container}>
            <View style={styles.closeButton}>
                <ButtonClose />
                <Text style={{ fontSize: 20 }}>Hủy</Text>
            </View>

            <View style={styles.contentPostContainer}>
                <View>
                    <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                </View>

                <View>
                    <Text style={{ fontSize: 17, fontWeight: 700 }}>dinh.thevuong</Text>

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
                        >
                            {selectedMedia.map((item, index) => (
                                <View>

                                    {
                                        item.type === "video" ?
                                            <VideoCustom key={index} videoUri={item.uri}
                                                action={() => {
                                                    setSelectedMedia((prevImages) =>
                                                        prevImages.filter((_, i) => i !== index)
                                                    );
                                                }}
                                                canDelete={true} />

                                            :
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    openImageViewer(index)
                                                }}
                                            >
                                                <ImageSelected
                                                    imageUrl={item.uri}
                                                    action={() => {
                                                        setSelectedMedia((prev) =>
                                                            prev.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                />
                                            </TouchableOpacity>
                                    }
                                </View>
                            ))}

                        </ScrollView>
                    ) : null}
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
                                imageUrls={selectedMedia.map((item) => ({ url: item.uri }))}
                                index={selectedImageIndex}
                                onSwipeDown={closeImageViewer}
                                enableImageZoom={true}
                                backgroundColor="black"
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


            <View style={{
                position: "absolute", bottom: 0, backgroundColor: "red",
                // top: '10%',
                left: '50%',
                transform: [{ translateX: -50 }, { translateY: 0 }],
                padding: 10, borderRadius: 15, paddingHorizontal: 30
            }}>
                <TouchableOpacity onPress={() => { }} >
                    <Text style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Cập nhật</Text>
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

export default EditPost

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
    mediaContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    media: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
})