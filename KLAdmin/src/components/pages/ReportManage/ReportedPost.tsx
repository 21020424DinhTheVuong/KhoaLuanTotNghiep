import React, { useState } from "react";
import {
    Box, Modal, Typography, styled, Button,
    TableContainer, TableCell, TableBody, TableHead, TableFooter, Table, TableRow, tableCellClasses,
    CardMedia, Paper, Pagination, ImageList, ImageListItem, Dialog
} from "@mui/material";
import { COLORS, FONT } from "../../hooks/useTheme";
import { ArrowForward, Close } from "@mui/icons-material";
import logo from "../../../assets/logo.png"
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

interface PostId {
    type?: string;
    id: number;
    content?: string;
    content_image: string | any;
    create_at: Date
}

const ReportedPost: React.FC<PostId> = ({ type, id, content, content_image, create_at }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const handleGetReportInfor = () => {
        handleOpen();
    }
    const imageData = content_image?.split(",") || []
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const handleClickOpen = (src: string) => {
        setSelectedImage(src);
        setOpenImage(true);
    };

    const handleCloseImage = () => {
        setOpenImage(false);
        setSelectedImage("");
    };

    const deletePost = async (id: number) => {
        if (window.confirm("Bạn có muốn xóa?")) {
            try {
                await apiClient.delete(`delete-post/${id}`)

            } catch (error) {
                alert("Reply Post not found")
            } finally {
                window.location.reload()
            }
        }
    }
    return (
        <Box>
            {/* <Button variant="outlined" onClick={() => handleGetBookChapter()}>Chi tiết</Button> */}
            <Box sx={{ display: "flex", flexDirection: "row", columnGap: 1, justifyContent: "center", alignItems: "center" }}>
                <Button onClick={() => { handleGetReportInfor() }}>Chi tiết</Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalCustom >
                    <Box sx={{ backgroundColor: "white", width: "100%", justifyItems: "center" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "black" }}>
                            Thông tin bài viết
                        </Typography>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table sx={{ width: "80vw" }} aria-label="customized table">
                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="center">ID Bài viết</StyledTableCell>
                                    <StyledTableCell align="center">Nội dung</StyledTableCell>
                                    <StyledTableCell align="center">Hình ảnh</StyledTableCell>
                                    <StyledTableCell align="center">Ngày đăng</StyledTableCell>
                                    <StyledTableCell align="center">Xóa</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow >
                                    <StyledTableCell align="center" >
                                        <Typography variant='subtitle1' className='book_infor'>{id}</Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="center" >
                                        <Typography variant='subtitle1' className='book_infor'>{content}</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center" >
                                        <ImageList sx={{}} cols={3} rowHeight={164}>
                                            {imageData.map((item: any, index: any) => (
                                                <ImageListItem key={index} >
                                                    {item.endsWith(".mp4") ? (
                                                        <CardMedia component="video" controls src={`http://localhost:3300/${item}`} width={200} height={150} onClick={() => handleClickOpen(item)} />
                                                    ) : (
                                                        <img src={`http://localhost:3300/${item}`} alt="Full Image" loading="lazy" style={{ width: 100, height: 100 }}
                                                            onClick={() => handleClickOpen(item)} />
                                                    )}
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </StyledTableCell>

                                    <StyledTableCell align="center" >
                                        <Typography variant='subtitle1'>{new Date(create_at).toLocaleString()}</Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="center"  >
                                        <Close onClick={() => { deletePost(id) }} sx={{ cursor: "pointer", ":hover": { color: COLORS.salmon } }} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ModalCustom>
            </Modal>
            <Dialog open={openImage} onClose={() => handleCloseImage()} maxWidth="md">
                <Close sx={{ position: "absolute", right: 10, top: 5, cursor: "pointer" }} onClick={() => handleCloseImage()} />
                <div style={{ padding: 20, textAlign: "center", marginTop: 15 }}>
                    {selectedImage.endsWith(".mp4") ? (
                        <CardMedia component="video" controls src={`http://localhost:3300/${selectedImage}`} width={700} />
                    ) : (
                        <img src={`http://localhost:3300/${selectedImage}`} alt="Full Image" style={{ maxWidth: "100%", height: "auto" }} />
                    )}
                </div>
            </Dialog>
        </Box>
    );
};

export default ReportedPost;