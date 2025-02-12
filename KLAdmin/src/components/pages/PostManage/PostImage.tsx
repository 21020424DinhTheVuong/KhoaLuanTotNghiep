import { Box, Button, Dialog, ImageList, ImageListItem, Modal, styled } from '@mui/material'
import React, { useState } from 'react'
import logo from "../../../assets/test.webp"
import test from "../../../assets/logo.png"
import { Close } from '@mui/icons-material'
import ListImage from './ListImage'

const ImageListCustom = styled(ImageList)({
    width: "100vw",
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

})
interface PostId {
    content_image?: string
}

const PostImage: React.FC<PostId> = ({ content_image }) => {
    const [showImageList, setShowImageList] = useState(false)
    const dataImage = content_image?.split(",") || []
    return (
        <>
            <Box>
                <Button onClick={() => { setShowImageList(!showImageList) }}>Chi tiết</Button>
            </Box>
            <Modal
                open={showImageList}
                onClose={() => setShowImageList(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ height: "80vh", marginLeft: 5 }}>
                    <Close sx={{ position: "absolute", right: 20, top: 20, cursor: "pointer" }} onClick={() => setShowImageList(false)} />

                    <ImageListCustom cols={6} rowHeight={164}>
                        {dataImage.map((item, index) => (
                            <ImageListItem key={index} sx={{ marginRight: 5, cursor: "pointer" }} >
                                <ListImage image={item} />
                            </ImageListItem>
                        ))}
                    </ImageListCustom>
                </Box>
            </Modal>

        </>
    )
}

export default PostImage
