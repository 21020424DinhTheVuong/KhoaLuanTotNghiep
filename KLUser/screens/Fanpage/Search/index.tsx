import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import ButtonBack from '../../../common/ButtonBack'
import { Ionicons } from '@expo/vector-icons'
import SearchResult from './SearchResult'
import apiClient from '../../../hooks/ApiRequest/apiClient'

type Props = {}
type UserResult = {
    id: number;
    username: string;
    display_name: string;
    avatar: string
}
function Search({ }: Props) {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [dataResult, setDataResult] = useState<UserResult[]>([])
    const searchUser = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get("accounts/search", {
                params: {
                    searchValue: search.trim()
                }
            })
            setDataResult(response.data)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonBack}>
                <ButtonBack />
                <Text style={{ fontSize: 20, marginLeft: 110, fontWeight: 600 }}>Tìm kiếm</Text>
            </View>

            <View style={styles.searchBar}>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder='Tìm kiếm...'
                    style={{ width: "80%" }}
                    onSubmitEditing={searchUser}
                />
                <TouchableOpacity onPress={searchUser}>
                    <Ionicons name='search' size={18} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    loading ?
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator size={30} />
                        </View>
                        :
                        dataResult.map((item, index) => (
                            <SearchResult key={index} userData={item} />
                        ))
                }

            </ScrollView>
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 20,
        paddingBottom: "25%",
    },
    buttonBack: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 0.3,
        borderBottomColor: "gray",
        paddingBottom: 10,
    },
    searchBar: {
        display: "flex",
        flexDirection: "row",
        borderWidth: 0.5,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 20,
        paddingHorizontal: 10
    }
})