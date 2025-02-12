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
import ReportedPost from './ReportedPost';
import ReportedUser from './ReportedUser';
import ReporterUser from './ReporterUser';
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
interface ReportInterface {
    id: number,
    reporter?: { id: any, username: any, dispaly_name: string, avatar: string } | any,
    reported?: { id: any, username: any, dispaly_name: string, avatar: string } | any,
    // reporter: any,
    // reported: any,
    post?: { id: number, content_text: string, content_image: string, create_at: Date };
    replyPost?: { id: number, content_reply_post: string, content_reply_post_image: string, create_at: Date }
    replyPostChildren?: { id: number, content_reply_post_children: string, create_at: Date }
    reason_report: string;
    create_at: Date;
    type?: string
}

export default function Reports() {
    const [reportData, setReportData] = useState<ReportInterface[]>([])
    const [totalReports, setTotalReports] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const getReports = async () => {
        try {
            const response = await apiClient.get("get-report", {
                params: {
                    page: page,
                    limit: 2
                }
            })
            let updateResponse = response.data.reports.map((item: ReportInterface) => ({
                ...item,
                type: item.post
                    ? "post"
                    : item.replyPost
                        ? "replyPost"
                        : item.replyPostChildren
                            ? "replyPostChildren"
                            : undefined
            }));
            setReportData(updateResponse)
            setTotalReports(response.data.total)
        } catch (error) {

        }
    };

    useEffect(() => {
        getReports();
    }, [page]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        const nextPage = newPage + 1; // Convert 0-based to 1-based index
        setPage(nextPage);           // Update state with the correct page
        getReports();        // Fetch data for the correct page
    };
    const handleDeleteReport = async (id: number) => {
        if (window.confirm("Bạn có muốn xóa?")) {
            try {
                await apiClient.delete(`delete-report/${id}`)
            } catch (error) {
                alert("Không tìm thấy báo cáo!")
            } finally {
                window.location.reload();
            }
        }
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ border: 1, backgroundColor: COLORS.gray }}>
                    <TableRow>
                        <TableCellHeader align='center'>STT</TableCellHeader>

                        <TableCellHeader align='center'>Người báo cáo</TableCellHeader>
                        <TableCellHeader align='center'>Người bị báo cáo</TableCellHeader>
                        <TableCellHeader align='center'>Bài viết</TableCellHeader>
                        <TableCellHeader align='center'>Lí do báo cáo</TableCellHeader>
                        <TableCellHeader align='center'>Ngày báo cáo</TableCellHeader>
                        <TableCellHeader align='center'>Xóa</TableCellHeader>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {reportData.map((item, index) => (
                        <TableRow key={item.id} sx={{ border: 1 }}>
                            <TableCellCustom align='center' component="th" scope="row" >
                                {index + 1}
                            </TableCellCustom>

                            <TableCellCustom align='center'>
                                <ReporterUser user_id={item.reporter ? item.reporter.id : null} username={item.reporter ? item.reporter.username : null} />
                            </TableCellCustom>

                            <TableCellCustom align='center'>
                                <ReportedUser user_id={item.reported.id || null} username={item.reported.username || null} />
                            </TableCellCustom>

                            <TableCellCustom align="center" >
                                <ReportedPost id={item.id} type={item.type}
                                    content={item.post?.content_text || item.replyPost?.content_reply_post || item.replyPostChildren?.content_reply_post_children}
                                    content_image={item.post?.content_image || item.replyPost?.content_reply_post_image || ""}
                                    create_at={item.create_at} />
                            </TableCellCustom>

                            <TableCellCustom align="right" >{item.reason_report}</TableCellCustom>
                            <TableCellCustom align="right">{new Date(item.create_at).toLocaleString()}</TableCellCustom>
                            <TableCellCustom align="center" >

                                <IconButton onClick={() => { handleDeleteReport(item.id) }}>
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
                count={totalReports}
                rowsPerPage={2}
                page={page - 1} // Adjust for 0-based page index
                onPageChange={handleChangePage}
            />
        </TableContainer>

    );
}
