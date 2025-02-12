import React, { useEffect, useState } from "react";
import {
    Box, Modal, Typography, styled, Button,
    TableContainer, TableCell, TableBody, TableHead, TableFooter, Table, TableRow, tableCellClasses,
    CardMedia, Paper, Pagination
} from "@mui/material";
import { COLORS, FONT } from "../../hooks/useTheme";
import { ArrowForward, Close } from "@mui/icons-material";
import logo from "../../../assets/logo.png"
import PageChapter from "./PageChapter";
import apiClient from "../../constants/apiClient";

const ModalCustom = styled(Box)({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    width: "80%",
    // backgroundColor: 'rgb(0,0,0)',
    border: '2px solid #000',
    boxShadow: '24',
    p: 4,
    justifyItems: "center"
});
const StyledTableCell = styled(TableCell)(() => ({
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#212529",
        color: COLORS.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    '& .book_infor': {
        fontWeight: FONT.medium,
        // color: COLORS.salmon
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({

    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const PaginationCustom = styled(Pagination)(({ theme }) => ({
    justifyItems: "center",
    backgroundColor: "black",
    width: "100%",

    "& .MuiPaginationItem-root": {
        color: "white", // Change number color
        //   fontWeight: "bold",
    },
    "& .Mui-selected": {
        backgroundColor: theme.palette.primary.main, // Background for selected item
        color: "black", // Selected number color
    },

}))

const NameBook = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: '20px'
})
interface BookId {
    book_id: number;
    chapters: number
}
interface PageInfor {
    page_id: number;
    chapter_id: number;
    page_number: number;
    page_image: string;
}
interface BookChapterInfor {
    id: number;
    title: string;
    chapter_number: number;
    create_at: Date;
    pages: PageInfor[]
}
const ChapterList: React.FC<BookId> = ({ book_id, chapters }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [totalChapter, setTotalChapter] = useState({ totalChap: 0, totalPage: 0 })
    const [currentPage, setCurrentPage] = useState(1)
    const [bookChapters, setBookChapters] = useState<BookChapterInfor[]>([])
    const getBookChapter = async () => {
        try {
            const response = await apiClient.get(`get-chapter/${book_id}`, {
                params: {
                    page: currentPage,
                    limit: 5
                }
            })
            // console.log(response.data)
            setBookChapters(response.data.chapters)
            setTotalChapter({ totalChap: response.data.totalChapters, totalPage: response.data.totalPages })
        } catch (error) {
            // console.log(error)
            setTotalChapter({ totalChap: 0, totalPage: 0 })
        }
    }
    useEffect(() => {
        getBookChapter()
    }, [currentPage])

    const handleGetBookChapter = () => {
        getBookChapter();
        handleOpen();
    }

    const deleteChapter = async (id: number) => {
        if (window.confirm("Bạn có muốn xóa?")) {
            try {
                await apiClient.delete(`delete-chapter/${id}`)
            } catch (error) {
                alert("Thất bại!")
            } finally {
                window.location.reload()
            }
        }
    }
    return (
        <Box>
            {/* <Button variant="outlined" onClick={() => handleGetBookChapter()}>Chi tiết</Button> */}
            <Box sx={{ display: "flex", flexDirection: "row", columnGap: 1, justifyContent: "center", alignItems: "center" }}
                onClick={() => { handleGetBookChapter() }}>
                <Typography variant="body1" className="description" >
                    Số chương: {chapters}
                </Typography>
                <ArrowForward sx={{ fontSize: 20, }} />
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalCustom >
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "black" }}>
                        Danh sách chương
                    </Typography> */}
                    <PaginationCustom count={totalChapter.totalPage} page={currentPage}
                        onChange={(_, newPage) => setCurrentPage(newPage)} color="primary"
                    />
                    <TableContainer component={Paper}>
                        <Table sx={{ width: "80vw" }} aria-label="customized table">
                            <TableHead>
                                <TableRow >
                                    <StyledTableCell sx={{ width: "20px" }}>STT</StyledTableCell>
                                    <StyledTableCell align="center">Tên Chương</StyledTableCell>
                                    <StyledTableCell align="center">Chương</StyledTableCell>
                                    <StyledTableCell align="center">Ngày cập nhật</StyledTableCell>
                                    <StyledTableCell align="center">Danh sách trang sách</StyledTableCell>
                                    <StyledTableCell align="center">Xóa</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {
                                totalChapter.totalChap !== 0 ?
                                    <TableBody>

                                        {bookChapters.map((item, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>
                                                    {index + 1}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <NameBook>
                                                        {/* <CardMedia image={item.cover_image} title="" sx={{ height: 75, width: 100 }} /> */}
                                                        <Typography variant="subtitle1" sx={{ textTransform: "uppercase" }}>{item.title}</Typography>
                                                    </NameBook>
                                                </StyledTableCell>

                                                <StyledTableCell align="center" >
                                                    <Typography variant='subtitle1' className='book_infor'>{item.chapter_number}</Typography>
                                                </StyledTableCell>

                                                <StyledTableCell align="center" >
                                                    <Typography variant='subtitle1'>{new Date(item.create_at).toLocaleString()}</Typography>
                                                </StyledTableCell>

                                                <StyledTableCell align="center" >
                                                    <PageChapter chapter_id={item.id} />
                                                </StyledTableCell>

                                                <StyledTableCell align="center"  >
                                                    <Close onClick={() => { deleteChapter(item.id) }} sx={{ cursor: "pointer", ":hover": { color: COLORS.salmon } }} />
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>

                                    :
                                    <TableBody>
                                        <StyledTableRow >
                                            <StyledTableCell align="center" >
                                                <Typography variant='subtitle1'>Không có chương</Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <StyledTableCell align="center" >
                                                    <Typography variant='subtitle1'></Typography>
                                                </StyledTableCell>
                                            </StyledTableCell>

                                            <StyledTableCell align="center" >
                                                <Typography variant='subtitle1'></Typography>
                                            </StyledTableCell>

                                            <StyledTableCell align="center" >
                                                <Typography variant='subtitle1'></Typography>
                                            </StyledTableCell>

                                            <StyledTableCell align="center" >
                                                <Typography variant='subtitle1'></Typography>
                                            </StyledTableCell>

                                            <StyledTableCell align="center" >
                                                <Typography variant='subtitle1'></Typography>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                            }
                        </Table>
                    </TableContainer>
                </ModalCustom>
            </Modal>
        </Box>
    );
};

export default ChapterList;