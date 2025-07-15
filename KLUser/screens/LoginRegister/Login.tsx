import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react'
import SnackBarCustom, { SnackBarCustomRef } from '../../common/SnackBar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import apiClient from '../../hooks/ApiRequest/apiClient';
import { useAuth } from '../../hooks/Auth/authContext';

type FormValues = {
    username: string;
    password: string,
}
const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
const Login = () => {
    const { login } = useAuth()
    const navigation = useNavigation<any>()
    const [loading, setLoading] = useState(false)

    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const showPassword = () => {
        setPasswordVisible(!isPasswordVisible);
    }

    const snackbarRef = useRef<SnackBarCustomRef>(null);

    const handleShowSnackbar = () => {
        snackbarRef.current?.showMessage('Wrong username or password!', 'red'); // Pass text color
    };

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        try {
            // Sending data to the server
            const response = await apiClient.post('auth/login', {
                username: data.username,
                password: data.password
            });
            const { id, username, display_name, role, avatar, create_at, sex } = response.data.account
            // console.log(response.data);
            login({
                id, username, display_name, role, avatar, create_at, sex
            })
            // navigation.navigate("Home")
        } catch (error: any) {
            handleShowSnackbar()
        } finally {
            setLoading(false)
        }
        // reset(); // Reset the form after submission
    };
    return (
        <View style={styles.container}>

            <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Image source={require('../../assets/logo.png')} style={{ width: 100, height: 100 }} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 30, fontWeight: 700, color: "red" }}>Đăng nhập</Text>
            </View>

            <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, errors.username && styles.errorInput]}
                            placeholder="Tài khoản"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    </View>

                )}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>

                        <TextInput
                            style={[styles.input, errors.password && styles.errorInput]}
                            placeholder="Mật khẩu"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!isPasswordVisible}
                            onSubmitEditing={handleSubmit(onSubmit)}
                        />
                        <TouchableOpacity onPress={showPassword} style={styles.icon}>
                            <Ionicons
                                name={isPasswordVisible ? 'eye' : 'eye-off'} // Switch icon
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <View style={styles.otherFunction}>
                {/* <TouchableOpacity>
                    <Text style={{ textDecorationLine: "underline", color: "red", fontSize: 16 }}>Quên mật khẩu</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => { navigation.navigate("Register") }}>
                    <Text style={{ textDecorationLine: "underline", color: "red", fontSize: 16 }}>Chưa có tài khoản?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    {
                        loading ?
                            <ActivityIndicator size={30} color={"white"} />
                            :
                            <Text style={{ fontSize: 20, fontWeight: 600, color: "white", textAlign: "center" }}>Đăng nhập</Text>
                    }
                </TouchableOpacity>
            </View>



            {/* <View style={{ borderBottomWidth: 1, marginHorizontal: 150 }}>
                <Text style={{ fontSize: 18, textAlign: "center", fontWeight: 600 }}>Khác</Text>
            </View>

            <View style={styles.otherLogin}>
                <TouchableOpacity style={styles.googleLogin}>
                    <Image source={require('../../assets/google-color-icon.png')} style={{ width: 30, height: 30 }} />

                    <Text style={{ fontSize: 16 }}>Đăng nhập bằng Google</Text>
                </TouchableOpacity>
            </View> */}
            <View style={{ marginTop: 180 }}>
                <SnackBarCustom defaultTextColor='white' ref={snackbarRef} />
            </View>

        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        marginTop: "30%",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        // alignContent: "center",
        // justifyContent: "center"
    },
    titleContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: {
        marginHorizontal: 40,
        // width: "80%",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 20,
        // paddingHorizontal: 15,
    },
    input: {
        height: 40,
        margin: 12,
        width: "80%",
        fontSize: 16,
    },
    icon: {
        padding: 5,
        position: "absolute",
        right: 10,
        top: 18
    },
    otherFunction: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: 40,
        marginTop: 10
    },
    buttonContainer: {
        marginVertical: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        marginHorizontal: 30
    },
    button: {
        width: "50%",
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        borderRadius: 20,
    },
    otherLogin: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,

        // flexDirection: "row"
        // borderWidth: 1,
    },
    googleLogin: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 20,
        borderWidth: 0.3,
        paddingHorizontal: 40,
        paddingVertical: 5,
        borderRadius: 10
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginHorizontal: 42
    },
})