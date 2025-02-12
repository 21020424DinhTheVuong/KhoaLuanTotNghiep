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
import logo from "../../../assets/logo.png"
import { Button, Typography, styled } from '@mui/material';
import ReporterUser from '../ReportManage/ReporterUser';
import ReportedUser from '../ReportManage/ReportedUser';
import PostImage from './PostImage';
import ReplyPost from './ReplyPost';
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
interface PostInterface {
    id: number,
    user: { id: number, username: string, avatar: string };
    content_text: string;
    content_image: string;
    like_post: number;
    create_at: string
}

export default function Posts() {
    const [postsData, setPostData] = useState<PostInterface[]>([])
    const [totalPost, setTotalPost] = useState(postsData.length)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [page, setPage] = useState<number>(1);

    const getAllPosts = async () => {
        try {
            const response = await apiClient.get("get-all-posts", {
                params: { page: page, limit: 2 }
            })
            setPostData(response.data.posts);
            setTotalPost(response.data.totalPosts)
        } catch (error) {

        }
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        const nextPage = newPage + 1; // Convert 0-based to 1-based index
        setPage(nextPage);           // Update state with the correct page
        // getUsers(nextPage);        // Fetch data for the correct page
    };
    useEffect(() => {
        getAllPosts()
    }, [page])

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
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ border: 1, backgroundColor: COLORS.gray }}>
                    <TableRow>
                        <TableCellHeader align='center'>STT</TableCellHeader>

                        <TableCellHeader align='center'>Người đăng</TableCellHeader>
                        <TableCellHeader align='center'>Nội dung</TableCellHeader>
                        <TableCellHeader align='center'>Hình ảnh</TableCellHeader>
                        <TableCellHeader align='center'>Lượt thích</TableCellHeader>
                        <TableCellHeader align='center'>Bình luận</TableCellHeader>
                        <TableCellHeader align='center'>Ngày đăng</TableCellHeader>
                        <TableCellHeader align='center'>Xóa</TableCellHeader>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {postsData.map((item, index) => (
                        <TableRow key={item.id} sx={{ border: 1 }}>
                            <TableCellCustom align='center' component="th" scope="row" >
                                {index + 1}
                            </TableCellCustom>

                            <TableCellCustom align='center'>
                                <ReporterUser user_id={item.user.id} username={item.user.username} />

                            </TableCellCustom>


                            <TableCellCustom align="right" >{item.content_text}</TableCellCustom>
                            <TableCellCustom align="center" >
                                <PostImage content_image={item.content_image} />
                            </TableCellCustom>
                            <TableCellCustom align="right" >{item.like_post}</TableCellCustom>

                            <TableCellCustom align="right" >
                                <ReplyPost post_id={item.id} />
                            </TableCellCustom>

                            <TableCellCustom align="right">{new Date(item.create_at).toLocaleString()}</TableCellCustom>
                            <TableCellCustom align="center" >

                                <IconButton onClick={() => { deletePost(item.id) }}>
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
                count={totalPost}
                rowsPerPage={2}
                page={page - 1} // Adjust for 0-based page index
                onPageChange={handleChangePage}
            />
        </TableContainer>

    );
}
