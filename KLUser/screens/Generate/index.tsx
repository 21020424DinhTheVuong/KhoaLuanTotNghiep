import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Button, ActivityIndicator, Image, Alert, Dimensions, Modal } from 'react-native'
import ButtonBack from '../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../hooks/useTheme'
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ImageViewer from 'react-native-image-zoom-viewer';

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "Your-API-Key"; // Replace with your API key
const genAI = new GoogleGenerativeAI(API_KEY);
const { width, height } = Dimensions.get("screen");
const GenerateScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [input, setInput] = useState("");
    const [imageUrl, setImageUrl] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openImageViewer = () => {
        setIsModalVisible(true); // Open the modal
    };

    const closeImageViewer = () => {
        setIsModalVisible(false); // Close the modal
    };

    const saveGeminiImage = async (base64Data: string) => {
        try {
            const fileUri = `${FileSystem.cacheDirectory}gemini_image_${Date.now()}.png`;
            // console.log(fileUri)
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return fileUri; // Return a local file URI (works like ImagePicker)
        } catch (error) {
            console.error("Error saving image:", error);
            return null;
        }
    };
    const generateImage = async () => {
        if (!input.trim()) {
            Alert.alert("Lỗi", "Hãy nhập mô tả");
            return;
        }

        setLoading(true);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp-image-generation",
            generationConfig: {
                responseModalities: ['Text', 'Image']
            },
        });
        try {
            const response = await model.generateContent(input);
            if (!response.response.candidates[0].content.parts) {
                Alert.alert("Lỗi", "Tạo ảnh thất bại. Hãy thử lại.");
                return;
            }
            for (const part of response.response.candidates[0].content.parts) {
                if (part.inlineData) {
                    // const imageData = part.inlineData.data;

                    const localUri = await saveGeminiImage(part.inlineData.data);
                    if (localUri) {
                        setImageUrl(localUri); // Format like ImagePicker
                    }

                    // setImageUrl(`data:image/png;base64,${imageData}`);
                }
            }
        } catch (error) {
            console.error("Error generating content:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveImage = async (imageUrl: string) => {
        if (!imageUrl) return;

        const filename = FileSystem.cacheDirectory + "generated_image.png";

        try {
            // Tải ảnh về bộ nhớ tạm
            await FileSystem.writeAsStringAsync(filename, imageUrl, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Mở giao diện chia sẻ
            await Sharing.shareAsync(filename);
        } catch (error) {
            console.error("Lỗi chia sẻ ảnh:", error);
            Alert.alert("Lỗi", "Không thể chia sẻ ảnh.");
        }
    };
    return (
        <View style={styles.container}>
            <View style={{ position: "absolute", top: 10, left: 20, }}>
                <ButtonBack />
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
                {imageUrl && (
                    <TouchableOpacity onPress={() => openImageViewer()} style={{
                        width: "100%",
                        height: 300,
                    }}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                        />
                    </TouchableOpacity>

                )}
                {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }} />}

                <View style={styles.input}>
                    <TextInput
                        placeholder="Nhập ảnh muốn tạo"
                        value={input}
                        onChangeText={setInput}
                        style={styles.textInput}
                    />
                    <TouchableOpacity disabled={loading} onPress={generateImage}
                        style={{
                            backgroundColor: loading ? "#ff8c8c" : "red",
                            height: 40,
                            width: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            marginBottom: 10
                        }}>
                        <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Tạo ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={imageUrl ? false : true}
                        onPress={() => navigation.navigate("ForumScreen", { screen: "UserPost", params: { imageUrl: imageUrl } })}
                        style={{
                            backgroundColor: imageUrl ? "red" : "#ff8c8c",
                            height: 40,
                            width: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            marginBottom: 10
                        }}>
                        <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Đăng bài</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={imageUrl ? false : true} onPress={() => saveImage(imageUrl || "")}
                        style={{
                            backgroundColor: imageUrl ? "red" : "#ff8c8c",
                            height: 40,
                            width: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10
                        }}>
                        <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>Chia sẻ</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
                        imageUrls={[{ url: imageUrl || "" }]} // Fix the syntax
                        index={0} // Index should start from 0
                        onSwipeDown={closeImageViewer}
                        enableImageZoom={true}
                        backgroundColor="black"
                    />
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    scroll: {
        alignItems: "center",
        marginTop: 10
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "contain",
    },
    input: {
        marginTop: 20,
        alignItems: "center",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        width: 300,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default GenerateScreen;
