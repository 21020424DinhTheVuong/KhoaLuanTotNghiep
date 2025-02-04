import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import ButtonBack from '../../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import Post from '../MainForum/Post'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { baseURL } from '../../../constants'
import apiClient from '../../../hooks/ApiRequest/apiClient'

type PostInterface = {
    id: number;
    content_text: string;
    content_image: string | null;
    like_post: number;
    create_at: string;
    update_at: string;
    total_reply_post: number;
    user: { id: number; display_name: string; avatar: string }
}
const UserProfile = () => {
    const route = useRoute<any>();
    // console.log(route.params)
    const userData = route.params.userData;
    const [dataUserPost, setDataUserPost] = useState<PostInterface[]>([])

    const getUserInfor = async () => {
        try {
            const response = await apiClient.get(`posts/user/${userData.id}`)
            setDataUserPost(response.data)
        } catch (error) {

        }
    }

    // useEffect(() => {
    //     getUserInfor()
    // }, []);
    useFocusEffect(
        useCallback(() => {
            getUserInfor(); // Fetch fresh data when this screen is focused
        }, [])
    );

    const likePost = async (postId: number) => {
        try {
            await apiClient.patch(`posts/like-post/${postId}`);
            getUserInfor()
        } catch (error) {

        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonBack}>
                <ButtonBack />
                <Text style={{ fontSize: 17 }}>Trở về</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.userInforContainer}>
                    <View>
                        <Text style={{ fontSize: 25, fontWeight: 600 }}>{userData.display_name}</Text>
                        <Text style={{ fontSize: 18 }}>{userData.username}</Text>

                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 5,
                            marginTop: 5
                        }}>
                            <Ionicons name='mail' size={20} color={"gray"} />
                            <Text>{userData.username}</Text>

                        </View>
                    </View>
                    {
                        userData.avatar ?
                            <Image source={{ uri: `${baseURL}/${userData.avatar}` }} style={styles.avatar} />
                            :
                            <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                    }
                </View>

                <View style={{ borderBottomWidth: 0.4, borderTopWidth: 0.4, paddingVertical: 10, }}>
                    <Text style={{ fontSize: 18 }}>Bài đăng</Text>
                </View>

                {
                    dataUserPost.length > 0 ?
                        <View>
                            {
                                dataUserPost.map((item, index) => (
                                    <Post key={index} reportType='report' data={item}
                                        action={() => { likePost(item.id) }} />
                                ))
                            }
                        </View>
                        :
                        <View style={{ marginTop: 20, }}>
                            <Text style={{ fontSize: 18, textAlign: "center" }}>Chưa có bài đăng.</Text>
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 20,
        paddingBottom: "10%",
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
    avatar: {
        height: 70,
        width: 70,
        borderRadius: 100,
        borderWidth: 0.3
    },
    userInforContainer: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30
    }
})