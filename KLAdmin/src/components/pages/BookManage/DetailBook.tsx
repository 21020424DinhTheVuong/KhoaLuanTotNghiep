import React, { useEffect, useState } from "react";
import { Box, CardMedia, Button, Typography, styled, Card } from "@mui/material"
import { Edit, Delete } from "@mui/icons-material";
import { COLORS, FONT, SIZES } from "../../hooks/useTheme";
import ChangeBook from "./ChangeBook";
import logo from "../../../assets/logo.png"
import AddChapter from "./AddChapter";


const BoxDescription = styled(Box)({
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
})
const BoxActionButton = styled(Box)({
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20
})
interface GenreInterface {
    id: number;
    type: string;
}
interface BookDetail {
    id: number,
    book_name: string,
    other_book_name: string,
    artist_change: string,
    chapters: number,
    genre: GenreInterface[]
    status: string,
    nation: string,
    description: string,
    cover: string,
    create_at: Date;
    update_at: string
}
const DetailBook: React.FC<BookDetail> = ({ id, book_name, other_book_name, artist_change, chapters, status, genre, nation, description, cover, create_at, update_at }) => {

    const deleteBook = () => {

    }

    return (
        <Box sx={{ width: 400 }} role="presentation">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "20%", height: 250, overflow: 'hidden' }}>
                <Card sx={{ position: 'relative', maxWidth: 370 }}>
                    {/* book Image */}
                    <CardMedia
                        component="img"
                        alt="Book Image"
                        height="200"
                        image={`http://localhost:3300/${cover}`}
                        sx={{ objectFit: 'cover' }}
                    />
                </Card>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
                <Typography variant="h4" sx={{ textTransform: "capitalize" }}>{book_name}</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", marginLeft: "10%", marginTop: "15px" }}>
                <Typography sx={{ fontWeight: 700, textTransform: "capitalize" }}>- Tên khác: {other_book_name}</Typography>
                <Typography sx={{ fontWeight: 700, textTransform: "capitalize" }}>- Tác giả: {artist_change}</Typography>
                <Typography sx={{ fontWeight: 700, textTransform: "capitalize" }}>- Thể loại: {genre.map(item => { return item.type + ", " })}</Typography>
                <Typography sx={{ fontWeight: 700, textTransform: "capitalize" }}>- Số chương: {chapters}</Typography>
                <Typography sx={{ fontWeight: 700, textTransform: "capitalize" }}>- Trạng thái: {status}</Typography>
                <Typography sx={{ fontWeight: 700, textTransform: "capitalize" }}>- Ngày đăng: {new Date(create_at).toLocaleString()}   </Typography>
                <Typography sx={{ fontWeight: 700, textTransform: "capitalize" }}>- Cập nhật lần cuối: {new Date(update_at).toLocaleString()}</Typography>

                <BoxDescription>
                    <Typography sx={{ fontWeight: 700 }}>Mô tả</Typography>
                    <Typography sx={{ color: "text.secondary" }}>{description}</Typography>
                </BoxDescription>

            </Box>
            <BoxActionButton>
                {/* <Button variant="outlined" startIcon={<Edit />}>Change</Button> */}
                <ChangeBook id_change={id}
                    book_name_change={book_name}
                    other_name_change={other_book_name}
                    artist={artist_change}
                    nation_change={nation}
                    // chapters={chapters}
                    genre_change={genre}
                    status_change={status}
                    description_change={description}
                    cover_change={logo}
                />

                <AddChapter book_id={id} chapters={chapters} book_name={book_name} />

            </BoxActionButton>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button variant="outlined" startIcon={<Delete />} onClick={() => { deleteBook() }}
                    style={{ color: "red" }}
                >Delete</Button>
            </Box>
        </Box>

    )
}

export default DetailBook