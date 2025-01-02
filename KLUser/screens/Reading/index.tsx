import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Button, ScrollView, Dimensions, Image } from 'react-native'
import ButtonBack from '../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modal'

const { width, height } = Dimensions.get("window")

const Reading = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.buttonBack}>
                    <ButtonBack />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        One Piece One Piece One Piece One Piece One Piece OneP {' - '}
                        <Text style={{ fontSize: 16 }}>Chap 1</Text>
                    </Text>
                </View>

                <View style={styles.buttonHandleChap}>
                    <TouchableOpacity style={styles.pageButton}>
                        <Ionicons name="arrow-back" size={20} color={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.chapPicker} onPress={toggleModal}>
                        <Text>Chap 10</Text>
                        <Ionicons name='caret-down-outline' />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pageButton}>
                        <Ionicons name="arrow-forward" size={20} color={"white"} />
                    </TouchableOpacity>

                </View>

                <View style={styles.imageContainer}>
                    {Array.from({ length: 10 }, (_, index) => (
                        <Image
                            key={index}
                            source={require("../../assets/onepiece.png")}
                            style={styles.image}
                        // resizeMode="cover" 
                        />
                    ))}
                </View>


                <View style={styles.buttonHandleChap}>
                    <TouchableOpacity style={styles.pageButton}>
                        <Ionicons name="arrow-back" size={20} color={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.chapPicker} onPress={toggleModal}>
                        <Text>Chap 10</Text>
                        <Ionicons name='caret-down-outline' />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pageButton}>
                        <Ionicons name="arrow-forward" size={20} color={"white"} />
                    </TouchableOpacity>

                </View>

            </ScrollView>


            <View>
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={toggleModal} // Closes the modal when tapping outside
                    animationIn='zoomIn' // Custom animation for opening
                    animationOut='zoomOut'
                >
                    <View style={styles.modalPicker}>
                        <TouchableOpacity onPress={() => { toggleModal() }} style={{ marginLeft: "95%" }}>
                            <Ionicons name="close" size={20} />
                        </TouchableOpacity>
                        <ScrollView >
                            {Array.from({ length: 20 }, (_, index) => (
                                <TouchableOpacity key={index} onPress={() => { toggleModal() }}>
                                    <Text style={styles.chap}>
                                        Item {index + 1}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

export default Reading

const styles = StyleSheet.create({
    container: {
        // marginHorizontal: 20,
        marginVertical: 20
    },
    buttonBack: {
        marginHorizontal: 20
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 350,
        marginHorizontal: 20

    },
    title: {
        fontSize: 20,
        fontWeight: 600
    },
    buttonHandleChap: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 30,
        marginVertical: 10,
    },
    pageButton: {
        padding: 10,
        backgroundColor: "red",
        borderRadius: 5,
    },
    pageInfo: {
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    chapPicker: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 5
    },
    modalPicker: {
        height: height * 0.8,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        borderRadius: 5
        // alignItems: "center"
    },
    scrollChap: {

    },
    chap: {
        margin: 5,
        paddingLeft: "40%",
        // left: "50%",
        fontSize: 20,
        backgroundColor: "whitesmoke"
    },
    imageContainer: {
        display: "flex",
        flexDirection: "column",
        padding: 0, // Remove any container padding
        margin: 0,
        rowGap: 5
    },
    image: {
        objectFit: 'fill',
        width: width,
        // height: height * (15 / 16)
    }
})