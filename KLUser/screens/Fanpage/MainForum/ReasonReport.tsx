import React, { useRef, useMemo, useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import SnackBarCustom, { SnackBarCustomRef } from '../../../common/SnackBar';
import apiClient from '../../../hooks/ApiRequest/apiClient';
import { useAuth } from '../../../hooks/Auth/authContext';


const reportChoices = [
    { id: 1, choice: "Tôi không thích nội dung này" },
    { id: 2, choice: "Bắt nạt hoặc liên hệ theo cách không mong muốn" },
    { id: 3, choice: "Tự tử, từ gây thương tích" },
    { id: 4, choice: "Bạo lực, thù ghét hoặc bóc lột" },
    { id: 5, choice: "Bán hoặc quảng cáo mặt hàng bị hạn chế" },
    { id: 6, choice: "Ảnh khỏa thân hoặc hoạt động tình dục" },
    { id: 7, choice: "Lừa đảo, gian lận hoặc spam" },
    { id: 8, choice: "Thông tin sai sự thật" },
];
type ReportType = {
    reportType: string;
    reportedId: number;
    postId?: number;
    replyPostId?: number;
    replyPostChildrenId?: number;
    refresh: () => void;
    onCloseReportModal: () => void
    data: { id: number; content: string, content_image?: any }
}

const ReasonReport = ({ reportType, reportedId, postId, replyPostId, replyPostChildrenId, refresh, data, onCloseReportModal }: ReportType) => {
    const { user } = useAuth()
    const navigation = useNavigation<any>()
    const [isVisible, setIsVisible] = useState(false);
    const [translateY, setTranslateY] = useState(0);
    const [loading, setLoading] = useState(false)
    const handleGesture = (event: any) => {
        if (event.nativeEvent.translationY > 50) {
            setIsVisible(false);
        }
        setTranslateY(event.nativeEvent.translationY);
    };
    const snackbarRef = useRef<SnackBarCustomRef>(null);

    const handleShowSnackbar = (message: string, color: string) => {
        snackbarRef.current?.showMessage(message, color); // Pass text color
    };
    const handleReport = async (reasonReport: any) => {
        setLoading(true)
        try {
            await apiClient.post("reports/create", {
                reporterId: user?.id,
                reportedId: reportedId,
                postId: postId,
                replyPostId: replyPostId,
                replyPostChildrenId: replyPostChildrenId,
                reasonReport: reasonReport
            })
            handleShowSnackbar("Báo cáo thành công!", "green")
        } catch (error) {
            handleShowSnackbar("Báo cáo thất bại!", "red")
        } finally {
            setLoading(false);
            setTimeout(() => {
                setIsVisible(false)
            }, 1000);
        }
    }

    const deletePost = async (refreshScreen: any) => {
        let typeDelete: string | null = null;
        if (postId) { typeDelete = `delete-post/${postId}` };
        if (replyPostId) { typeDelete = `delete-reply-post/${replyPostId}` };
        if (replyPostChildrenId) { typeDelete = `delete-reply-post-children/${replyPostChildrenId}` }
        try {
            const response = await apiClient.delete(`posts/${typeDelete}`)
            if (response.data === "Delete Successfully") {
                Alert.alert(
                    'Thành công',
                    'Đã xóa!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                refreshScreen();
                                setIsVisible(false)
                            },
                        },
                    ],
                );
            }
        } catch (error) {
            Alert.alert("Thất bại", "Bài đã xóa hoặc không tồn tại.")
        }
    }
    return (
        <View style={styles.container}>
            {
                reportType === 'report' ?
                    <TouchableOpacity onPress={() => { setIsVisible(true) }}>

                        <View style={styles.modalPicker}>

                            <Text style={{ color: "red", fontSize: 20 }}>Báo cáo</Text>
                            <Ionicons name="warning" size={20} color={"red"} />
                        </View>
                    </TouchableOpacity>

                    :
                    (
                        <View>
                            {
                                !replyPostChildrenId &&

                                <TouchableOpacity onPress={() => { onCloseReportModal(); navigation.navigate("EditPost", { postId, replyPostId, data }) }}>
                                    <View style={styles.modalPicker}>
                                        <Text style={{ fontSize: 20 }}>Chỉnh sửa</Text>
                                        <Ionicons name="pencil" size={20} />
                                    </View>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity onPress={() => { deletePost(refresh) }}>
                                <View style={styles.modalPicker}>
                                    <Text style={{ fontSize: 20 }}>Xóa bài</Text>
                                    <Ionicons name="trash" size={20} />
                                </View>
                            </TouchableOpacity>

                        </View>
                    )
            }

            <Modal
                isVisible={isVisible}
                style={styles.modal}
                onBackdropPress={() => setIsVisible(false)}
                swipeDirection={['down']}
                onSwipeComplete={() => setIsVisible(false)}
            >
                <Ionicons name='remove-outline' size={20} color={"red"} />
                <PanGestureHandler onGestureEvent={handleGesture}>
                    <View style={styles.bottomSheet}>
                        {
                            loading && <ActivityIndicator size={25} />
                        }
                        <Text style={styles.text}>Báo cáo</Text>
                        <Text style={{ fontSize: 18, textAlign: "center", paddingVertical: 10, borderBottomWidth: 0.5 }}>Tại sao bạn báo cáo bài viết này?</Text>
                        <View>
                            {reportChoices.map((item) => (
                                <TouchableOpacity key={item.id} onPress={() => { handleReport(item.choice) }}>

                                    <Text style={styles.reportChoice}>
                                        {item.choice}
                                    </Text>

                                </TouchableOpacity>

                            ))}
                        </View>
                        <SnackBarCustom defaultTextColor="white" ref={snackbarRef} />
                    </View>

                </PanGestureHandler>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    bottomSheet: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    reportChoice: {
        fontSize: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: "gray",
        marginTop: 15,
        paddingBottom: 15,
        maxWidth: "90%"
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ReasonReport;
