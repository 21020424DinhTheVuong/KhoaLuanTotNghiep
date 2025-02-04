import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Button, Image, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from '../../../hooks/Auth/authContext';
import apiClient from '../../../hooks/ApiRequest/apiClient';
import { useForm, Controller } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import { useFocusEffect, useNavigation } from '@react-navigation/native';


type UserInfor = {
    username: string,
    display_name: string;
    sex: string;
    create_at: string;
    avatar: string
}
const schema = yup.object().shape({
    display_name: yup.string().required("Display name is required!")
});
const ChangeInformation = () => {
    const navigation = useNavigation<any>()
    const { user, login } = useAuth()
    // console.log(user)
    const [userInfor, setUserInfor] = useState<UserInfor>()
    const [displayName, setDisplayName] = useState(userInfor?.display_name);
    const [sex, setSex] = useState("Nam"); // Default selected value
    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<any>(null);
    const [loading, setLoading] = useState(false)

    const getUserInfor = async () => {
        try {
            const response = await apiClient.get(`accounts/${user?.id}`);
            setUserInfor(response.data);
            // console.log(response.data)
            setSex(user?.sex!)
        } catch (error) {

        }
    }
    useFocusEffect(
        useCallback(() => {
            getUserInfor(); // Fetch fresh data when this screen is focused
        }, [])
    );
    // Select an image
    const selectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Denied', 'You need to grant media library permissions to select an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'], // Updated to use MediaType array
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            console.log(result.assets[0])
            setAvatarFile({
                uri: result.assets[0].uri,
                type: result.assets[0].mimeType,
                name: `${user?.id}.jpg`
            })
            // setAvatarFile(result.assets[0])
        }
    };


    const handleUpdate = async () => {
        if (displayName === '') {
            Alert.alert("Error", "Display name is required!")
            return;
        }
        const formData = new FormData();
        formData.append("display_name", String(displayName).trim());
        formData.append("sex", sex);
        if (avatarFile) {
            formData.append("avatar", avatarFile as any);
        }
        setLoading(true)
        try {
            await apiClient.patch(`accounts/change-information/${user?.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            getUserInfor()
            login({
                avatar: userInfor?.avatar,
                display_name: userInfor?.display_name,
                sex: userInfor?.sex,
                ...user,
            });
        } catch (error) {
            Alert.alert("Không thành công", "Hãy thử lại!");
            // console.error(error);
        } finally {
            setLoading(false);
            Alert.alert(
                'Thành công',
                'Nhấn OK để trở về!',
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
    };
    return (
        <View style={styles.container}>
            <TextInput
                editable={false}
                style={styles.inputConstant}
                // onChangeText={onChangeText}
                value={userInfor?.username}
                placeholder="Tài khoản"
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Tên hiển thị"
                    // onBlur={onBlur}
                    defaultValue={userInfor?.display_name}
                    onChangeText={setDisplayName}
                    value={displayName}
                />
            </View>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={sex}
                    onValueChange={(itemValue) => setSex(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Nam" value="Nam" />
                    <Picker.Item label="Nữ" value="Nữ" />
                    <Picker.Item label="Khác" value="Khác" />
                </Picker>
            </View>

            <View style={styles.uploadImage}>
                <TouchableOpacity onPress={selectImage}>
                    <Text style={{ fontSize: 16, color: "white", textAlign: "center" }}>
                        Upload Avatar
                    </Text>
                </TouchableOpacity>
            </View>
            {/* <Button title="Select Image" onPress={selectImage} /> */}

            {avatar && (
                <Image
                    source={{ uri: avatar }}
                    style={styles.image}
                />
            )}

            <View style={styles.button}>

                <TouchableOpacity onPress={() => { handleUpdate() }}
                    disabled={loading}>
                    {
                        loading ?
                            <ActivityIndicator size="large" color="white" />
                            :
                            <Text style={{ color: 'white', fontSize: 20, textAlign: "center" }}>
                                Xác nhận
                            </Text>
                    }
                </TouchableOpacity>
            </View>

            {/* {loading && <ActivityIndicator size="large" color="#007bff" />} */}
        </View>
    )
}

export default ChangeInformation

const styles = StyleSheet.create({
    container: {
        // display: "flex",
        marginHorizontal: 20
    },
    inputConstant: {
        height: 60,
        margin: 12,
        borderWidth: 1,
        borderColor: "#D2CECE",
        borderRadius: 5,
        padding: 15,
    },
    inputContainer: {
        margin: 12,
        // width: "80%",
        borderWidth: 1,
        borderRadius: 5,
        // marginTop: 20,
        // paddingHorizontal: 15,
    },
    // input: {
    //     height: 60,
    //     margin: 12,
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     paddingHorizontal: 15,
    //     fontSize: 16
    // },
    input: {
        height: 40,
        margin: 12,
        width: "80%",
        fontSize: 16,
    },
    pickerContainer: {
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        overflow: 'hidden',
    },
    picker: {
        height: 60,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        // marginBottom: 20,
        // borderWidth: 1,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 20,
        marginHorizontal: 12
    },
    uploadImage: {
        borderWidth: 1,
        borderColor: "aqua",
        borderRadius: 5,
        backgroundColor: "red",
        width: "35%",
        marginLeft: 12,
        marginTop: 20,
        padding: 8
    },
    button: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "red",
        marginHorizontal: 110,
        height: 50,
        padding: 10,
        borderRadius: 5,
        width: "auto",
        marginTop: 20
    },
})