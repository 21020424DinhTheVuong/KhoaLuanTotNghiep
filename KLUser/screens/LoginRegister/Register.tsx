import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ImageBackground, Image, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import apiClient from '../../hooks/ApiRequest/apiClient';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SnackBarCustom, { SnackBarCustomRef } from '../../common/SnackBar';
type FormValues = {
    username: string;
    display_name: string;
    password: string,
    confirm_password: string
}

const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    display_name: yup.string().required('Display name is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const Register = () => {
    const navigation = useNavigation<any>()
    const [selectedSex, setSelectedSex] = useState('Nam'); // Default selected value
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const showPassword = () => {
        setPasswordVisible(!isPasswordVisible);
    }

    const snackbarRef = useRef<SnackBarCustomRef>(null);

    const handleShowSnackbar = (message: string, color: string) => {
        snackbarRef.current?.showMessage(message, color); // Pass text color
    };

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        try {
            // Sending data to the server
            const response = await apiClient.post('auth/register', {
                username: data.username,
                display_name: data.display_name,
                sex: selectedSex,
                password: data.password
            });
            // console.log(response.data);
            handleShowSnackbar
        } catch (error: any) {
            handleShowSnackbar("Tài khoản đã tồn tại!", "red")
        } finally {
            setLoading(false)
            handleShowSnackbar("Đăng ký thành công!", "green")
            navigation.navigate("Login")
        }
        // reset(); // Reset the form after submission
    };

    return (

        <View style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView>

                    <View style={{ alignItems: "center", marginBottom: 10 }}>
                        <Image source={require('../../assets/logo.png')} style={{ width: 100, height: 100 }} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={{ fontSize: 30, fontWeight: 700, color: "red" }}>Đăng ký</Text>
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
                        name="display_name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.input, errors.display_name && styles.errorInput]}
                                    placeholder="Tên hiển thị"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>
                        )}
                    />
                    {errors.display_name && <Text style={styles.errorText}>{errors.display_name.message}</Text>}

                    <View style={styles.pickerContainer}>

                        <Picker
                            selectedValue={selectedSex}
                            onValueChange={(itemValue) => setSelectedSex(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Nam" value="Name" />
                            <Picker.Item label="Nữ" value="Nữ" />
                            <Picker.Item label="Khác" value="Khác" />
                        </Picker>
                    </View>
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
                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>

                                <TextInput
                                    style={[styles.input, errors.confirm_password && styles.errorInput]}
                                    placeholder="Nhập lại mật khẩu"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={!isPasswordVisible}
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
                    {errors.confirm_password && <Text style={styles.errorText}>{errors.confirm_password.message}</Text>}
                    <View style={styles.otherFunction}>
                        <TouchableOpacity onPress={() => { navigation.navigate("Login") }}>
                            <Text style={{ textDecorationLine: "underline", color: "red", fontSize: 16 }}>Đã có tài khoản?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </KeyboardAvoidingView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    {
                        loading ?
                            <ActivityIndicator size={20} color={"white"} />
                            :
                            <Text style={{ fontSize: 20, fontWeight: 600, color: "white", textAlign: "center" }}>Đăng ký</Text>
                    }
                </TouchableOpacity>
            </View>

            <SnackBarCustom defaultTextColor="white" ref={snackbarRef} />

        </View>
        // </ImageBackground>

    )
}

export default Register

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: "20%",
        display: "flex",
        flexDirection: "column",
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
        justifyContent: 'flex-end',
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
    pickerContainer: {
        marginTop: 20,
        marginHorizontal: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        overflow: 'hidden',
    },
    picker: {
        height: 60,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        // marginBottom: 20,
        // borderWidth: 1,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginHorizontal: 42
    },
})