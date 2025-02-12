import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Clear } from '@mui/icons-material';
import { COLORS } from '../../hooks/useTheme';
import logo from "../../../assets/avatar.jpg"
import { styled } from '@mui/material';
import apiClient from '../../constants/apiClient';

const TableCellCustom = styled(TableCell)({
    borderLeft: "2px solid gray",
    borderRight: "2px solid gray",
    borderBottom: "2px solid gray",
});
const TableCellHeader = styled(TableCell)({
    borderRight: "2px solid black",
    fontWeight: 700,
    fontSize: 16
})
interface UserInterface {
    id: number,
    username: string,
    display_name: string,
    create_at: string,
    update_at: string;
    sex: string;
    avatar: string
    // role: string
}

export default function Users() {
    const [userData, setUserData] = useState<UserInterface[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0)
    const [page, setPage] = useState<number>(1);

    const getUsers = async () => {
        try {
            const response = await apiClient.get(`get-users?page=${page}&limit=2`);
            setUserData(response.data.users);
            setTotalPages(response.data.totalPages);
            setTotalUsers(response.data.total)
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, [page]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        const nextPage = newPage + 1; // Convert 0-based to 1-based index
        setPage(nextPage);           // Update state with the correct page
        // getUsers(nextPage);        // Fetch data for the correct page
    };
    const handleDeleteUser = async (index: any) => {
        if (window.confirm("Đồng ý xóa?")) {

            try {
                const response = await apiClient.delete(`delete-user/${index}`)

            } catch (error) {
                alert("Không tìm thấy người dùng!")
            } finally {
                window.location.reload()
            }
        }
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ border: 1, backgroundColor: COLORS.gray }}>
                    <TableRow>
                        <TableCellHeader align='center'>STT</TableCellHeader>

                        <TableCellHeader align='center'>Tên tài khoản</TableCellHeader>
                        <TableCellHeader align='center'>Tên hiển thị</TableCellHeader>
                        <TableCellHeader align='center'>Avatar</TableCellHeader>
                        <TableCellHeader align='center'>Giới tính</TableCellHeader>
                        <TableCellHeader align='center'>Ngày tạo</TableCellHeader>
                        <TableCellHeader align='center'>Ngày cập nhật</TableCellHeader>
                        <TableCellHeader align='center'>Xóa</TableCellHeader>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {userData.map((item, index) => (
                        <TableRow key={item.id} sx={{ border: 1 }}>
                            <TableCellCustom align='center' component="th" scope="row" >
                                {index + 1}
                            </TableCellCustom>
                            <TableCellCustom >
                                {item.username}
                            </TableCellCustom>
                            <TableCellCustom align="left" >{item.display_name}</TableCellCustom>
                            <TableCellCustom align='center' >
                                {
                                    item.avatar ?
                                        <img src={`http://localhost:3300/${item.avatar}`} alt='' style={{ height: 50, width: 50 }} />
                                        :
                                        <img src={logo} alt='' style={{ height: 50, width: 50 }} />
                                }

                            </TableCellCustom>
                            <TableCellCustom align="right" >{item.sex}</TableCellCustom>

                            <TableCellCustom align="right" >{new Date(item.create_at).toLocaleString()}</TableCellCustom>
                            <TableCellCustom align="right">{new Date(item.update_at).toLocaleString()}</TableCellCustom>
                            <TableCellCustom align="right" >

                                <IconButton onClick={() => { handleDeleteUser(item.id) }}>
                                    <Clear />
                                </IconButton>

                            </TableCellCustom>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[2]} // Allow user to select rows per page
                component="div"
                count={totalUsers}
                rowsPerPage={2}
                page={page - 1} // Adjust for 0-based page index
                onPageChange={handleChangePage}
            />
        </TableContainer>

    );
}
