import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { COLORS } from '../../hooks/useTheme';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import apiClient from '../../constants/apiClient';


interface GenreInfor {
    id: number;
    type: string;
    describe: string
}
export default function GenreTable() {
    const [genres, setGenres] = useState<GenreInfor[]>([])

    const getAllGenre = async () => {
        try {
            const response = await apiClient.get("get-all-genres")
            setGenres(response.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        getAllGenre()
    }, [])

    const deleteGente = async (id: number) => {
        try {
            const response = await apiClient.delete(`delete-genre/${id}`)
            if (window.confirm(response.data.message)) {
                window.location.reload()
            }
        } catch (error) {
            alert("Thể loại không tồn tại!")
        }
    }
    return (
        <TableContainer component={Paper} sx={{ marginLeft: 10, marginRight: 10 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ border: 1, backgroundColor: COLORS.gray }}>
                    <TableRow>
                        <TableCell sx={{ borderRight: 1, fontWeight: 700, fontSize: 18 }} align='center'>STT</TableCell>
                        <TableCell sx={{ borderRight: 1, fontWeight: 700, fontSize: 18 }} align="center">Thể loại</TableCell>
                        <TableCell sx={{ borderRight: 1, fontWeight: 700, fontSize: 18 }} align="center">Mô tả</TableCell>
                        <TableCell sx={{ borderRight: 1, fontWeight: 700, fontSize: 18 }} align="center">Xóa</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {genres.map((item: GenreInfor, index) => (

                        <TableRow sx={{ border: 1 }} key={item.id} >

                            <TableCell align="center" component="th" scope="row" sx={{ borderRight: 1, borderBottom: 1 }}>
                                {index}
                            </TableCell>

                            <TableCell align="center" sx={{ borderRight: 1, borderBottom: 1 }}>{item.type}</TableCell>


                            <TableCell align="left" sx={{ borderRight: 1, borderBottom: 1, }} width={"60%"}>{item.describe}</TableCell>

                            <TableCell align="center" sx={{ borderRight: 1, borderBottom: 1 }} >
                                <Close onClick={() => { deleteGente(item.id) }} sx={{ cursor: "pointer", ":hover": { color: COLORS.salmon } }} />
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
            </Table>
        </TableContainer>

    );
}
