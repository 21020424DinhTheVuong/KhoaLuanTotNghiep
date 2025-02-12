import React, { useEffect, useState } from 'react'
import { styled, Box, Pagination, Stack, TextField, Tooltip, IconButton, Typography } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import Book from './Book'
import logo from "../../../assets/logo.png"
import AddBook from './AddBook'
import apiClient from '../../constants/apiClient'

const Container = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
})
const SearchCustom = styled(Box)({
    marginTop: 10
})
const BookContainer = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
})
interface BookInterface {
    id: number;
    book_name: string;
    other_name: string;
    artist: string;
    totalChapters: number;
    cover_image: string;
    nation: string;
    genre: [];
    status: string;
    create_at: Date;
    update_at: string
    description: string
}

const BookManage: React.FC = () => {

    const [searchValue, setSearchValue] = useState(" ");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [hasProduct, setHasProduct] = useState(true)
    const [books, setBooks] = useState<BookInterface[]>([]);
    const [totalProducts, setTotalProducts] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const PRODUCTS_PER_PAGE = 5;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 700);

        return () => {
            clearTimeout(handler); // Clear the timeout if the user types again
        };
    }, [searchValue]);
    // Fetch products based on search query and pagination
    const fetchBook = async () => {
        try {
            const response = await apiClient.get("get-all-books", {
                params: {
                    search: debouncedSearchValue.trim() || "",
                    page: currentPage,
                    limit: PRODUCTS_PER_PAGE
                }
            })
            // console.log(response.data)
            setBooks(response.data.book_list);
            setTotalProducts(response.data.total)
        } catch (error) {

        }
    };

    // Run search and fetch products when search term or page changes
    useEffect(() => {
        fetchBook();
    }, [debouncedSearchValue, currentPage]);
    return (
        <Container>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} flexDirection={"row"} width={"100%"} paddingLeft={"5%"} >
                <AddBook />
                <SearchCustom>
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={searchValue}
                        onChange={(e) => { setSearchValue(e.target.value); setCurrentPage(1) }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchBook(); // Run handleSearch when Enter is pressed
                            }
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <IconButton type="button" aria-label="search" size="small" onClick={() => { fetchBook() }}>
                                        <Search />
                                    </IconButton>
                                ),
                                sx: { pr: 0.5 },
                            },
                        }}
                        sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
                    />
                </SearchCustom>
            </Box>

            <BookContainer>

                {books.map((item, index) => (
                    <Book key={index}
                        id={item.id}
                        book_name={item.book_name}
                        other_book_name={item.other_name}
                        artist={item.artist}
                        genre={item.genre}
                        chapters={item.totalChapters}
                        status={item.status}
                        nation={item.nation}
                        cover={item.cover_image}
                        description={item.description}
                        create_at={item.create_at}
                        update_at={item.update_at}
                    />
                ))}
            </BookContainer>
            <Pagination count={Math.ceil(totalProducts / PRODUCTS_PER_PAGE)}  // Total pages based on products
                page={currentPage}  // Current page
                onChange={(_, newPage) => setCurrentPage(newPage)} color="primary" sx={{ marginTop: 10 }} />

        </Container>
    )
}

export default BookManage