import { useState } from "react";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>The Loai</Text>
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdownItems}>
                    <TouchableOpacity onPress={() => alert('Option 1')}>
                        <Text style={styles.dropdownItem}>Option 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('Option 2')}>
                        <Text style={styles.dropdownItem}>Option 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('Option 3')}>
                        <Text style={styles.dropdownItem}>Option 3</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
export default Dropdown

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerContent: {
        flex: 1,
        padding: 20,
    },
    drawerItem: {
        fontSize: 18,
        paddingVertical: 10,
    },
    dropdownContainer: {
        marginBottom: 20,
    },
    dropdownButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    dropdownButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    dropdownItems: {
        paddingLeft: 20,
        marginTop: 10,
    },
    dropdownItem: {
        fontSize: 16,
        paddingVertical: 8,
    },
});
