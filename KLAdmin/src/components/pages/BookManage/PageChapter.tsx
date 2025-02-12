import { Box, Button, ImageList, ImageListItem, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import Page from './Page'
import { Close } from '@mui/icons-material'
import apiClient from '../../constants/apiClient'
interface ChapterId {
    chapter_id: number
}
interface PageInterface {
    id: number;
    chapter_id: number;
    page_number: number;
    image: string;
    chapter_number: string;
}
const PageChapter: React.FC<ChapterId> = ({ chapter_id }) => {
    const [showImageList, setShowImageList] = useState(false);
    const [pageChapter, setPageChapter] = useState<PageInterface[]>([])
    const [totalPage, setTotalPage] = useState(0)

    const getPageChapter = async () => {
        try {
            const response = await apiClient.get(`get-page/${chapter_id}`)
            setPageChapter(response.data.pages)
            setTotalPage(response.data.total)
        } catch (error) {
            setTotalPage(0)
        }
    }
    return (
        <>
            <Box>
                <Button onClick={() => { setShowImageList(!showImageList); getPageChapter() }}>Chi tiết</Button>

            </Box>
            <Modal
                open={showImageList}
                onClose={() => setShowImageList(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", marginLeft: 5 }}>
                    <Close sx={{ position: "absolute", right: 20, top: 20, cursor: "pointer" }} onClick={() => setShowImageList(false)} />

                    {
                        totalPage !== 0 ?
                            <ImageList sx={{ width: "100vw", height: "80vh" }} cols={6} rowHeight={164}>
                                {pageChapter.map((item, index) => (
                                    <ImageListItem key={index} sx={{ marginBottom: 20 }}>
                                        <Page image={item.image} page_number={index} />
                                    </ImageListItem>
                                ))}

                            </ImageList>
                            : <Typography>Chưa có hình ảnh.</Typography>
                    }
                </Box>
            </Modal>
        </>
    )
}

export default PageChapter
