import React, { useEffect, useState } from "react";
import {
    Box, Modal, Typography, styled, Button,
    TableContainer, TableCell, TableBody, TableHead, TableFooter, Table, TableRow, tableCellClasses,
    CardMedia, Paper, Pagination
} from "@mui/material";
import { COLORS, FONT } from "../../hooks/useTheme";
import logo from "../../../assets/logo.png"
import Close from "@mui/icons-material/Close";
import ReporterUser from "../ReportManage/ReporterUser";
import ListImage from "./ListImage";
import PostImage from "./PostImage";
import ReplyPostChildren from "./ReplyPostChildren";
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
interface PostId {
    post_id: number;
}
interface PageInfor {
    page_id: number;
    chapter_id: number;
    page_number: number;
    page_image: string;
}
interface ReplyPostInfor {
    id: number;
    user: { id: number, username: string };
    content_reply_post: string;
    content_reply_post_image: string;
    like_post: number;
    create_at: string
}
const ReplyPost: React.FC<PostId> = ({ post_id }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState(0)
    const [replyPost, setReplyPost] = useState<ReplyPostInfor[]>([])
    const getReplyPost = async () => {
        try {
            const response = await apiClient.get(`get-replies-by-post-id/${post_id}`, {
                params: { page: page, limit: 2 }
            })
            setReplyPost(response.data.replies);
            setTotalPages(response.data.totalPages)
        } catch (error) {

        }
    }
    useEffect(() => {
        getReplyPost()
    }, [page])

    const handleGetReplyPost = () => {
        getReplyPost();
        handleOpen();
    }
    const deleteReplyPost = async (id: number) => {
        if (window.confirm("Bạn có muốn xóa?")) {
            try {
                await apiClient.delete(`delete-reply-post/${id}`)

            } catch (error) {
                alert("Reply Post not found")
            } finally {
                handleClose()
            }
        }
    }

    return (
        <Box>
            <Box>
                <Button onClick={() => { handleGetReplyPost() }}>Chi tiết</Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalCustom >
                    <PaginationCustom count={totalPages} page={page}
                        onChange={(_, newPage) => setPage(newPage)} color="primary"
                    />
                    <TableContainer component={Paper}>
                        <Table sx={{ width: "80vw" }} aria-label="customized table">
                            <TableHead>
                                <TableRow >
                                    <StyledTableCell sx={{ width: "100px" }}>ID Reply Post</StyledTableCell>
                                    <StyledTableCell align="center">Người đăng</StyledTableCell>
                                    <StyledTableCell align="center">Nội dung</StyledTableCell>
                                    <StyledTableCell align="center">Hình ảnh</StyledTableCell>
                                    <StyledTableCell align="center">Phản hồi</StyledTableCell>
                                    <StyledTableCell align="center">Lượt thích</StyledTableCell>
                                    <StyledTableCell align="center">Ngày đăng</StyledTableCell>
                                    <StyledTableCell align="center">Xóa</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {replyPost.map((item, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <ReporterUser user_id={item.user.id} username={item.user.username} />
                                        </StyledTableCell>

                                        <StyledTableCell align="center" >
                                            <Typography variant='subtitle1' className='book_infor'>{item.content_reply_post}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center" >
                                            <PostImage content_image={item.content_reply_post_image} />
                                        </StyledTableCell>

                                        <StyledTableCell align="center" >
                                            <ReplyPostChildren reply_id={item.id} />
                                        </StyledTableCell>

                                        <StyledTableCell align="center" >
                                            <Typography variant='subtitle1' className='book_infor'>{item.like_post}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center" >
                                            <Typography variant='subtitle1'>{new Date(item.create_at).toLocaleString()}</Typography>
                                        </StyledTableCell>

                                        <StyledTableCell align="center"  >
                                            <Close onClick={() => { deleteReplyPost(item.id) }} sx={{ cursor: "pointer", ":hover": { color: COLORS.salmon } }} />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ModalCustom>
            </Modal>
        </Box>
    );
};

export default ReplyPost;