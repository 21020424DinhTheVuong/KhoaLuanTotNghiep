import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native"
import apiClient from "../../hooks/ApiRequest/apiClient"

const genres = [
    { id: 1, genre: "Comedy" },
    { id: 2, genre: "Action" },
    { id: 3, genre: "Adventure" },
    { id: 4, genre: "Shounen" },
    { id: 5, genre: "Kinh di" },
]
type GenreInterface = {
    id: number;
    type: string
}
type IdBook = {
    id: number
}
const BookGenre = ({ id }: IdBook) => {
    const navigation = useNavigation<any>()

    const [dataGenre, setDataGenre] = useState<GenreInterface[]>([])

    const getBookGenre = async () => {
        try {
            const response = await apiClient.get(`books/${Number(id)}/genres`);
            setDataGenre(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getBookGenre()
    }, [])
    return (
        <View >
            {dataGenre.length > 0 && (
                <View style={styles.container}>
                    {dataGenre.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.genre}
                            onPress={() => navigation.navigate("FilterGenre", { genre: item.type })}
                        >
                            <Text style={styles.genreText}>{item.type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

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