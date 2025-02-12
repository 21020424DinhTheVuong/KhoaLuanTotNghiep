import { Close } from "@mui/icons-material"
import { Box, Card, Typography, Dialog, Modal, Tooltip, styled, CardMedia } from "@mui/material"
import { useState } from "react"
import videoTest from "../../../assets/video.mp4"

const BoxImage = styled(Box)({
    "& .image": {
        width: 200,
        objectFit: "contain",
        height: 200,
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "scale(1.1)",

        }
    }
})
interface PageImage {
    image: string;
}
const ListImage: React.FC<PageImage> = ({ image }) => {
    const [showImage, setShowImage] = useState(false)
    return (
        <>
            <BoxImage onClick={() => setShowImage(true)}>
                {image.endsWith(".mp4") ? (
                    <CardMedia component="video" controls src={`http://localhost:3300/${image}`} sx={{ width: 200, height: 200 }} />
                ) : (
                    <img
                        className="image"
                        src={`http://localhost:3300/${image}`}
                        alt=""
                        loading="lazy"
                    />
                )}
            </BoxImage>

            <Dialog open={showImage} onClose={() => setShowImage(false)} maxWidth="md">
                <Close sx={{ position: "absolute", right: 10, top: 5, cursor: "pointer" }} onClick={() => setShowImage(false)} />
                <div style={{ padding: 20, textAlign: "center", marginTop: 15 }}>
                    {image.endsWith(".mp4") ? (
                        <CardMedia component="video" controls src={`http://localhost:3300/${image}`} width={700} />
                    ) : (
                        <img src={`http://localhost:3300/${image}`} alt="Full Image" style={{ maxWidth: "100%", height: "auto" }} />
                    )}
                </div>
            </Dialog>

        </>
    )
}

export default ListImage