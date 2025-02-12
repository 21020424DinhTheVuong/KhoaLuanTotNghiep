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
interface ReplyId {
    reply_id: number;
}
interface PageInfor {
    page_id: number;
    chapter_id: number;
    page_number: number;
    page_image: string;
}
interface ReplyPostChildrenInfor {
    id: number;
    user: { id: number, username: string };
    content_reply_post_children: string;
    like_post: number;
    create_at: string
}
const ReplyPostChildren: React.FC<ReplyId> = ({ reply_id }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState(0)
    const [replyChildren, setReplyChildren] = useState<ReplyPostChildrenInfor[]>([])
    const getReplyChildren = async () => {
        try {
            const response = await apiClient.get(`get-reply-children-by-reply-id/${reply_id}`, {
                params: {
                    page: page,
                    limit: 2
                }
            })
            setReplyChildren(response.data.replyChildren);
            setTotalPages(response.data.totalPages)
        } catch (error) {

        }
    }

    const handleGetReplyChildrenPost = () => {
        getReplyChildren();
        handleOpen();
    }

    useEffect(() => {
        getReplyChildren()
    }, [page])

    const deleteReplyChildren = async (id: number) => {
        if (window.confirm("Bạn có muốn xóa?")) {
            try {
                await apiClient.delete(`delete-reply-children/${id}`)

            } catch (error) {
                alert("Reply Children not found")
            } finally {
                handleClose()
            }
        }
    }
    return (
        <Box>
            <Box>
                <Button onClick={() => { handleGetReplyChildrenPost() }}>Chi tiết</Button>
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
                                    <StyledTableCell sx={{ width: "20px" }}>ID Post</StyledTableCell>
                                    <StyledTableCell align="center">Người đăng</StyledTableCell>
                                    <StyledTableCell align="center">Nội dung</StyledTableCell>
                                    <StyledTableCell align="center">Lượt thích</StyledTableCell>
                                    <StyledTableCell align="center">Ngày đăng</StyledTableCell>
                                    <StyledTableCell align="center">Xóa</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {replyChildren.map((item, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <ReporterUser user_id={item.user.id} username={item.user.username} />
                                        </StyledTableCell>

                                        <StyledTableCell align="center" >
                                            <Typography variant='subtitle1' className='book_infor'>{item.content_reply_post_children}</Typography>
                                        </StyledTableCell>

                                        <StyledTableCell align="center" >
                                            <Typography variant='subtitle1' className='book_infor'>{item.like_post}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center" >
                                            <Typography variant='subtitle1'>{new Date(item.create_at).toLocaleString()}</Typography>
                                        </StyledTableCell>

                                        <StyledTableCell align="center"  >
                                            <Close onClick={() => { deleteReplyChildren(item.id) }} sx={{ cursor: "pointer", ":hover": { color: COLORS.salmon } }} />
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

export default ReplyPostChildren;