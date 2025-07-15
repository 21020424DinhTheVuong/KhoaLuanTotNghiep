import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native'
import ButtonBack from '../../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import Post from '../../Fanpage/MainForum/Post'
import { useAuth } from '../../../hooks/Auth/authContext'
import { baseURL } from '../../../constants'
import apiClient from '../../../hooks/ApiRequest/apiClient'

type UserData = {
    id: number,
    display_name: string,
    username: string,
    avatar: string
}
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
const MyPost = () => {
    const { user } = useAuth()
    const [userData, setUserData] = useState<UserData>()
    const [loading, setLoading] = useState(false)
    const [dataUserPost, setDataUserPost] = useState<PostInterface[]>([])
    const getUserPost = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get(`posts/user/${user?.id}`);
            setDataUserPost(response.data)
            // console.log(response.data)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    const getUserData = async () => {
        try {
            const response = await apiClient.get(`accounts/${user?.id}`);
            setUserData(response.data);
        } catch (error) {

        }
    }
    useEffect(() => {
        getUserData()
        getUserPost()
    }, [])

    const likePost = async (postId: number) => {
        try {
            await apiClient.patch(`posts/like-post/${postId}`);
            getUserPost()
        } catch (error) {

        }
    }
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.userInforContainer}>
                    <View>
                        <Text style={{ fontSize: 25, fontWeight: 600 }}>{userData?.display_name}</Text>
                        <Text style={{ fontSize: 18 }}>{userData?.username}</Text>

                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 5,
                            marginTop: 5
                        }}>
                            <Ionicons name='mail' size={20} color={"gray"} />
                            <Text>{userData?.username}</Text>

                        </View>
                    </View>
                    {
                        user?.avatar ?
                            <Image source={{ uri: `${baseURL}/${userData?.avatar}` }} style={styles.avatar} />
                            :
                            <Image source={require("../../../assets/avatar.png")} style={styles.avatar} />
                    }
                </View>

                <View style={{ borderBottomWidth: 0.4, borderTopWidth: 0.4, paddingVertical: 10, }}>
                    <Text style={{ fontSize: 18 }}>Bài đăng</Text>
                </View>

                {
                    loading ?
                        <ActivityIndicator size={40} />
                        :
                        dataUserPost.length > 0 ?
                            dataUserPost.map((item, index) => (
                                <Post key={index} reportType='user' data={item}
                                    action={() => { likePost(item.id) }}
                                    refreshAfterDelete={() => getUserPost()} />
                            ))
                            :
                            <Text>Chưa có bài viết nào.</Text>
                }

            </ScrollView>
        </View>
    )
}

export default MyPost

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