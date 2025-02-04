import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native'
import ButtonBack from '../../../common/ButtonBack'
import Post from './Post'
import UserPost from './UserPost'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import apiClient from '../../../hooks/ApiRequest/apiClient'
import { useAuth } from '../../../hooks/Auth/authContext'


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

function MainFanpage() {
    const { user } = useAuth()
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const [dataPost, setDataPost] = useState<PostInterface[]>([])

    const getAllPosts = async () => {
        try {
            const response = await apiClient.get("posts");
            setDataPost(response.data)
        } catch (error) {

        }
    }

    // useEffect(() => {
    //     getAllPosts()
    // }, []);
    useFocusEffect(
        useCallback(() => {
            getAllPosts(); // Fetch fresh data when this screen is focused
        }, [])
    );
    const likePost = async (postId: number) => {
        try {
            await apiClient.patch(`posts/like-post/${postId}`);
            getAllPosts()
        } catch (error) {

        }
    }
    return (

        <View style={styles.container}>
            <View style={styles.buttonBack}>
                <ButtonBack />
                <Text style={{ fontSize: 17 }}>Trở về</Text>
                <TouchableOpacity style={{ marginLeft: "70%" }}
                    onPress={() => { navigation.navigate("SearchUser") }}>
                    <Ionicons name="search-circle" size={35} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}
                // contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>

                <View>
                    <UserPost />
                </View>
                <View>
                    {
                        dataPost.map((item, index) => (
                            <Post key={index}
                                reportType={item.user.id === user?.id ? "userPost" : "report"}
                                data={item}
                                action={() => likePost(item.id)}
                                refreshAfterDelete={() => { getAllPosts() }} />
                        ))
                    }
                </View>
            </ScrollView>

        </View>

    )
}

export default MainFanpage

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 20,
        paddingBottom: "15%",
    },

    buttonBack: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 0.3,
        borderBottomColor: "gray",
        paddingBottom: 10
    }
})