import React, { useState } from "react";
import {
    Box, Modal, Typography, styled, Button,
    TableContainer, TableCell, TableBody, TableHead, TableFooter, Table, TableRow, tableCellClasses,
    CardMedia, Paper, Pagination, ImageList, ImageListItem, Dialog
} from "@mui/material";
import { COLORS, FONT } from "../../hooks/useTheme";
import { ArrowForward, Close } from "@mui/icons-material";
import logo from "../../../assets/avatar.jpg"
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

interface UserId {
    user_id: any;
    username: any
}

interface UserInfor {
    id: number;
    username: string;
    display_name: string;
    create_at: string;
    avatar: string;
}
const ReporterUser: React.FC<UserId> = ({ user_id, username }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [userInfor, setUserInfor] = useState<UserInfor>()
    const getUserInfor = async () => {
        if (user_id === null) {
            setUserInfor({ id: 0, username: "Đã xóa", display_name: "Đã xóa", create_at: "", avatar: "" })
            console.log("Looix")
            return;
        }
        try {
            const response = await apiClient.get(`get-user-by-id/${user_id}`)
            setUserInfor(response.data)
        } catch (error) {
            alert("User not found")
        }
    }

    const handleGetUserInfor = () => {
        getUserInfor();
        handleOpen();
    }
    const handleDeleteUser = async (index: any) => {
        if (window.confirm("Đồng ý xóa?")) {

            try {
                await apiClient.delete(`delete-user/${index}`)

            } catch (error) {
                alert("Không tìm thấy người dùng!")
            } finally {
                window.location.reload()
            }
        }
    }

    return (
        <Box>
            {/* <Button variant="outlined" onClick={() => handleGetBookChapter()}>Chi tiết</Button> */}
            <Typography sx={{ cursor: "pointer", "&:hover": { color: COLORS.salmon } }} onClick={handleGetUserInfor}>
                {username || "Null"}
            </Typography>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalCustom >
                    <Box sx={{ backgroundColor: "white", width: "100%", justifyItems: "center" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: "black" }}>
                            Thông tin
                        </Typography>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table sx={{ width: "80vw" }} aria-label="customized table">
                            <TableHead>
                                <TableRow >
                                    <StyledTableCell align="center">ID Người dùng</StyledTableCell>
                                    <StyledTableCell align="center">Tên đăng nhập</StyledTableCell>
                                    <StyledTableCell align="center">Tên hiển thị</StyledTableCell>
                                    <StyledTableCell align="center">Ngày tạo</StyledTableCell>
                                    <StyledTableCell align="center">Xóa</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow >
                                    <StyledTableCell align="center" >
                                        <Typography variant='subtitle1' className='book_infor'>{userInfor?.id || "Null"}</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center" sx={{ display: "flex", alignItems: "center", columnGap: 5 }}>
                                        {
                                            userInfor?.avatar ?
                                                <img src={`http://localhost:3300/${userInfor.avatar}`}
                                                    alt="" style={{ height: 50, width: 50 }} />
                                                :
                                                <img src={logo} alt="" style={{ height: 50, width: 50 }} />
                                        }
                                        <Typography variant="subtitle1">{userInfor?.username || "Null"}</Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="center" >
                                        <Typography variant='subtitle1' className='book_infor'>{userInfor?.display_name}</Typography>
                                    </StyledTableCell>


                                    <StyledTableCell align="center" >
                                        <Typography variant='subtitle1'>{new Date(userInfor?.create_at || "").toLocaleString()}</Typography>
                                    </StyledTableCell>

                                    <StyledTableCell align="center"  >
                                        {
                                            user_id &&
                                            <Close onClick={() => { handleDeleteUser(userInfor?.id) }} sx={{ cursor: "pointer", ":hover": { color: COLORS.salmon } }} />
                                        }
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ModalCustom>
            </Modal>

        </Box>
    );
};

export default ReporterUser;