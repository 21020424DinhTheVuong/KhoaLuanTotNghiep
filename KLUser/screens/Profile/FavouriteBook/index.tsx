import React, { useEffect, useState, useRef } from 'react'
import { ScrollView, Text, View } from 'react-native'
import Book from './Book'
import { useAuth } from '../../../hooks/Auth/authContext'
import apiClient from '../../../hooks/ApiRequest/apiClient'
import SnackBarCustom, { SnackBarCustomRef } from '../../../common/SnackBar'

type Props = {}
type BookType = {
    id: number,
    book_name: string;
    artist: string;
    cover_image: string
}
function FavouriteBook() {
    const { user } = useAuth()
    const [dataBook, setDataBook] = useState<BookType[]>([])
    const snackbarRef = useRef<SnackBarCustomRef>(null);

    const handleShowSnackbar = (message: string, color: string) => {
        snackbarRef.current?.showMessage(message, color); // Pass text color
    };

    const getFavouriteBook = async () => {
        try {
            const response = await apiClient.get(`accounts/${user?.id}/favourites`)
            setDataBook(response.data)
        } catch (error) {

        }
    }

    const removeBook = async (index: any) => {
        try {
            const response = await apiClient.delete(`accounts/remove/${user?.id}/${index}`)
            if (response.data === 'Book removed from favourites successfully') {
                handleShowSnackbar("Delete successfully!", "green")
                getFavouriteBook()
            }
        } catch (error) {
            handleShowSnackbar("Delete failed!", "red")
        }
    }
    useEffect(() => {

        getFavouriteBook()
    }, [])



    return (
        <View style={{ marginVertical: 20 }}>
            {
                dataBook.length > 0 ?
                    <ScrollView>
                        {
                            dataBook.map((item, index) => (
                                <Book key={index}
                                    id={item.id}
                                    book_name={item.book_name}
                                    artist={item.artist}
                                    cover_image={item.cover_image}
                                    action={() => { removeBook(item.id) }}
                                />
                            ))
                        }
                    </ScrollView>

                    :
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 700 }}>Danh sách trống.</Text>
                    </View>
            }

            < View style={{}}>
                <SnackBarCustom defaultTextColor='white' ref={snackbarRef} />
            </View>
        </View>
    )
}

export default FavouriteBook