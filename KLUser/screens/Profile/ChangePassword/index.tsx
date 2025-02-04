import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react'
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import apiClient from '../../../hooks/ApiRequest/apiClient';
import { useAuth } from '../../../hooks/Auth/authContext';
import SnackBarCustom, { SnackBarCustomRef } from '../../../common/SnackBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type FormValues = {
    oldPassword: string;
    newPassword: string,
}
const schema = yup.object().shape({
    oldPassword: yup.string().required('Password is required'),
    newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
});

const ChangePassword = () => {
    const navigation = useNavigation<any>()
    const { user, logout } = useAuth()
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };
    const snackbarRef = useRef<SnackBarCustomRef>(null);

    const handleShowSnackbar = (message: string, color: string) => {
        snackbarRef.current?.showMessage(message, color); // Pass text color
    };
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = async (data: FormValues) => {
        try {
            // const token = await AsyncStorage.getItem('access_token'); // Retrieve token from storage
            const response = await apiClient.patch(
                'auth/change-password', {
                userId: user?.id,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            }
            );

            handleShowSnackbar(response.data, "green")
            setTimeout(() => {
                logout()
            }, 1500);
            reset(); // Reset form after success
        } catch (error: any) {
            handleShowSnackbar(error.message, " red")
        }

    };
    return (
        <View style={styles.container}>

            <Controller
                control={control}
                name="oldPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>

                        <TextInput
                            style={[styles.input, errors.oldPassword && styles.errorInput]}
                            placeholder="Mật khẩu cũ"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!isPasswordVisible}
                        // onSubmitEditing={handleSubmit(onSubmit)}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                            <Ionicons
                                name={isPasswordVisible ? 'eye' : 'eye-off'} // Switch icon
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                )}
            />
            {errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword.message}</Text>}

            <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>

                        <TextInput
                            style={[styles.input, errors.newPassword && styles.errorInput]}
                            placeholder="Mật khẩu mới"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!isPasswordVisible}
                        // onSubmitEditing={handleSubmit(onSubmit)}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                            <Ionicons
                                name={isPasswordVisible ? 'eye' : 'eye-off'} // Switch icon
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                )}
            />
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>

                        <TextInput
                            style={[styles.input, errors.confirmPassword && styles.errorInput]}
                            placeholder="Xác nhận mật khẩu mới"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={!isPasswordVisible}
                        // onSubmitEditing={handleSubmit(onSubmit)}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                            <Ionicons
                                name={isPasswordVisible ? 'eye' : 'eye-off'} // Switch icon
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                )}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

            <View style={styles.button}>

                <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                    <Text style={{ color: 'white', fontSize: 20 }}>
                        Xác nhận
                    </Text>

                </TouchableOpacity>
            </View>

            <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center", marginTop: 400 }}>
                <SnackBarCustom defaultTextColor='white' ref={snackbarRef} />
            </View>
        </View>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    container: {
        // marginHorizontal: 20,
        alignItems: "center",
        // alignContent: "center",
        display: "flex"
    },
    inputContainer: {
        // margin: 12,
        marginVertical: 12,
        height: 60,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
    },

    input: {
        width: "80%",
        fontSize: 16
    },
    icon: {
        padding: 5,
        position: "absolute",
        right: 10
    },
    button: {
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "red",
        height: 50,
        padding: 10,
        borderRadius: 5,
        textAlign: "center",
        // width: "27%",
        marginTop: 20
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginHorizontal: 42
    },
})