import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useAuth } from '../../../hooks/Auth/authContext'
import apiClient from '../../../hooks/ApiRequest/apiClient'

type UserInfor = {
    username: string,
    display_name: string;
    sex: string;
    create_at: string
}

const MyAccount = () => {
    const { user } = useAuth()
    const [userInfor, setUserInfor] = useState<UserInfor>()
    useEffect(() => {
        const getUserInfor = async () => {
            try {
                const response = await apiClient.get(`accounts/${user?.id}`);
                setUserInfor(response.data)
            } catch (error) {

            }
        }
        getUserInfor()
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.inforContainer}>
                <Text style={styles.inforTitle}>Tên tài khoản</Text>
                <Text style={styles.inforContent}>{userInfor?.username}</Text>
            </View>
            <View style={styles.inforContainer}>
                <Text style={styles.inforTitle}>Tên hiển thị</Text>
                <Text style={styles.inforContent}>{userInfor?.display_name}</Text>
            </View>
            <View style={styles.inforContainer}>
                <Text style={styles.inforTitle}>Giới tính</Text>
                <Text style={styles.inforContent}>{userInfor?.sex}</Text>
            </View>
            <View style={styles.inforContainer}>
                <Text style={styles.inforTitle}>Ngày lập tài khoản</Text>
                <Text style={styles.inforContent}>{userInfor?.create_at.split("T")[0]}</Text>
            </View>
        </View>
    )
}

export default MyAccount;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 20,
        rowGap: 30
    },
    inforContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
    },
    inforTitle: {
        fontSize: 18,
        fontWeight: 600
    },
    inforContent: {
        fontSize: 16
    }
})