import React from 'react'
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modal'

interface TypeData {
    id: number;
    title: string;
    link: string;
    order?: string
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    data: TypeData[];
    onSelect: (data: any) => void
}
const { width, height } = Dimensions.get("window")
const ModalChooseFilter: React.FC<FilterModalProps> = ({ visible, onClose, data, onSelect }) => {
    return (
        <View>
            <Modal
                isVisible={visible}
                onBackdropPress={onClose} // Closes the modal when tapping outside
                animationIn='zoomIn' // Custom animation for opening
                animationOut='zoomOut'
            >
                <View style={styles.modalPicker}>
                    {/* <TouchableOpacity onPress={() => { toggleModal() }} style={{ marginLeft: "95%" }}> */}
                    {/* <Ionicons name="close" size={20} /> */}
                    {/* </TouchableOpacity> */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {data.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => { onSelect(item.title); onClose() }}>
                                <Text style={styles.chap}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        ))

                        }
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

export default ModalChooseFilter

const styles = StyleSheet.create({
    modalPicker: {
        maxHeight: height * 0.8,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        borderRadius: 5,
        justifyContent: "center",
        // alignItems: "center"
    },
    scrollChap: {

    },
    chap: {
        margin: 5,
        padding: 5,
        paddingLeft: "30%",
        // left: "50%",
        fontSize: 20,
        backgroundColor: "whitesmoke"
    },
})