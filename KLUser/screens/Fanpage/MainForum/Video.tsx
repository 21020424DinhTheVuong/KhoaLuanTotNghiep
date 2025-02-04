import { useCallback, useRef, useState } from "react"
// import { ResizeMode } from "expo-av"
import VideoPlayer from "expo-video-player"
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { ResizeMode, Video } from "expo-av"
import { useFocusEffect } from "@react-navigation/native"
import { baseURL } from "../../../constants"

type VideoURI = {
    videoUri?: string;
    action?: () => void;
    canDelete?: boolean
}
const { height, width } = Dimensions.get("window")
const VideoCustom = ({ videoUri = `${baseURL}/uploads/images_post/content_media-1738502405749-598434152.mp4`, action = () => { }, canDelete = true }: VideoURI) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    // console.log(ResizeMode.CONTAIN)
    useFocusEffect(
        useCallback(() => {
            return () => {
                // When leaving the screen, pause the video
                setIsPlaying(false)
            };
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            // Play the video when returning to the screen
            setIsPlaying(true)
        }, [])
    );

    return (
        <View style={[styles.container,]}>
            {
                canDelete &&
                <TouchableOpacity style={styles.deleteImage} onPress={() => { action() }}>
                    <Ionicons name="close" size={20} />
                </TouchableOpacity>
            }

            <VideoPlayer
                videoProps={{
                    // shouldPlay: true,
                    resizeMode: ResizeMode.COVER,
                    source: {
                        uri: videoUri || `${baseURL}/uploads/images_post/content_media-1738502405749-598434152.mp4`, // Đặt giá trị mặc định
                    },
                    // isLooping: true,
                }}
                style={{
                    width: 250, height: 250,
                }}
            />

        </View>
    )
}

export default VideoCustom

const styles = StyleSheet.create({
    container: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
        // objectFit: "cover"
    },
    deleteImage: {
        position: "absolute",
        backgroundColor: "gray",
        width: 20,
        borderRadius: 100,
        opacity: 0.5,
        right: 5,
        top: 5,
        zIndex: 99
    },
})