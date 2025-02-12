import { ArrowForward, ArrowForwardIos, Delete } from "@mui/icons-material";
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, IconButton, styled, Drawer } from "@mui/material";
import { useState } from "react";
import { COLORS, FONT, SIZES } from "../../hooks/useTheme";
import DetailBook from "./DetailBook";
import ChapterList from "./ChapterList";
import apiClient from "../../constants/apiClient";

const CardActionCustom = styled(CardActions)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10,
    marginLeft: 10,
    // '& .detail-button': {
    //     position: 'relative',
    //     bottom: 10
    // }    
})
const CardContentCustom = styled(CardContent)({
    flexGrow: 1,
    cursor: "pointer",
    // alignItems: "center",
    '& .description': {
        color: "text.secondary",
        // alignItems: "center"
    }
})
const Artist = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 20,

    '& .artist': {
        fontSize: SIZES.large,
        fontWeight: FONT.medium,
        color: COLORS.salmon
    }
})
interface GenreInterface {
    id: number;
    type: string;
}
interface BookData {
    id: number,
    book_name: string,
    other_book_name: string,
    artist: string,
    chapters: number,
    genre: GenreInterface[],
    status: string,
    nation: string,
    description: string,
    cover: string,
    create_at: Date;
    update_at: string
}
const Book: React.FC<BookData> = ({ id, book_name, other_book_name, artist, chapters, status, genre, nation, description, cover, create_at, update_at }) => {
    const [openDetail, setIsOpenDetail] = useState(false)
    const handleOpenDetail = () => {
        setIsOpenDetail(true)
    }
    const handleCloseDetail = () => {
        setIsOpenDetail(false);
    }
    const fetchDelete = async () => {
        try {
            const response = await apiClient.delete(`delete-book/${id}`);
            if (window.confirm(response.data.message)) {
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteBook = () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            fetchDelete();
        }
    }

    return (
        <Card sx={{ maxWidth: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250, overflow: 'hidden' }}>
                <Card sx={{ position: 'relative', maxWidth: 320, }}>
                    {/* Product Image */}
                    <CardMedia
                        component="img"
                        alt=""
                        image={`http://localhost:3300/${cover}`}
                        sx={{ objectFit: "contain", cursor: "pointer", }}
                        onClick={() => { handleOpenDetail() }}
                    />
                </Card>

            </Box>
            <CardContentCustom>
                <Typography gutterBottom variant="h5" component="div" onClick={() => { handleOpenDetail() }} sx={{ textTransform: "capitalize" }}>
                    {book_name}
                </Typography>
                <Artist>
                    <Typography variant="subtitle1" className="artist">
                        {artist}
                    </Typography>
                </Artist>
                <ChapterList book_id={id} chapters={chapters} />

            </CardContentCustom>
            <CardActionCustom>
                <Button variant="contained" size="small" onClick={() => { handleOpenDetail() }} className="detail-button">Chi tiết</Button>
                {/* <Button size="small">Delete</Button> */}
                <IconButton onClick={() => { handleDeleteBook() }}>
                    <Delete sx={{ color: "red" }} />
                </IconButton>
            </CardActionCustom>
            <Drawer
                anchor="right"
                open={openDetail}
                onClose={handleCloseDetail}
            >
                <DetailBook id={id}
                    book_name={book_name}
                    other_book_name={other_book_name}
                    artist_change={artist}
                    chapters={chapters}
                    status={status}
                    nation={nation}
                    genre={genre}
                    description={description}
                    cover={cover}
                    create_at={create_at}
                    update_at={update_at}
                />
            </Drawer>
        </Card>
    );
}

export default Book