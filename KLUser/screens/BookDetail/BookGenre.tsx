import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native"

const genres = [
    { id: 1, genre: "Comedy" },
    { id: 2, genre: "Action" },
    { id: 3, genre: "Adventure" },
    { id: 4, genre: "Shounen" },
    { id: 5, genre: "Kinh di" },
]
const BookGenre = () => {
    return (
        <View style={styles.container}>
            {
                genres.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.genre}>
                        <Text style={styles.genreText}>{item.genre}</Text>
                    </TouchableOpacity>
                ))
            }

        </View>
    )


}

export default BookGenre

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginLeft: 15,
        padding: 10,
    },
    genre: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1.5,
        borderColor: '#FF8800',
        borderRadius: 5,
        margin: 5,
    },
    genreText: {
        fontSize: 14,
        fontWeight: '500',
    },
})