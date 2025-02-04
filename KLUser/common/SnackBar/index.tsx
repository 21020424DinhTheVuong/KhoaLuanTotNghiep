import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Snackbar } from 'react-native-paper';
import { Text, StyleSheet } from 'react-native';

export interface SnackBarCustomRef {
    showMessage: (message: string, color?: string) => void;
}

interface SnackBarCustomProps {
    defaultTextColor?: string; // Optional default text color
}

const SnackBarCustom = forwardRef<SnackBarCustomRef, SnackBarCustomProps>(
    ({ defaultTextColor = 'white' }, ref) => {
        const [visible, setVisible] = useState(false);
        const [message, setMessage] = useState('');
        const [textColor, setTextColor] = useState(defaultTextColor);

        // Allow parent components to call `showMessage`
        useImperativeHandle(ref, () => ({
            showMessage: (msg: string, color?: string) => {
                setMessage(msg);
                setTextColor(color || defaultTextColor); // Use passed color or default
                setVisible(true);
                setTimeout(() => setVisible(false), 3000); // Hide after 3 seconds
            },
        }));

        return (
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={1000}
                style={styles.snackBar}
            >
                <Text style={[styles.text, { color: textColor }]}>{message}</Text>
            </Snackbar>
        );
    }
);

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    snackBar: {
        marginLeft: 20,
        width: "100%",
        backgroundColor: "white",
        // position: "absolute"
    }
});

export default SnackBarCustom;
