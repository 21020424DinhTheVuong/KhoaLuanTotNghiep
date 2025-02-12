import { Close } from "@mui/icons-material"
import { Box, Card, Typography, Dialog, Modal, Tooltip, styled } from "@mui/material"
import { useState } from "react"

const BoxImage = styled(Box)({
    "& .image": {
        width: 200,
        objectFit: "contain",
        height: "auto",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "scale(1.1)",

        }
    }
})
interface PageImage {
    image: string;
    page_number: number;
}
const Page: React.FC<PageImage> = ({ image, page_number }) => {
    const [showImage, setShowImage] = useState(false)
    return (
        <>
            <BoxImage onClick={() => { setShowImage(true) }}>
                <Tooltip
                    title={
                        <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                            Trang {page_number + 1}
                        </Typography>
                    }
                    // placement="top"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: "rgba(0, 0, 0, 0.8)",
                                padding: "8px",
                                borderRadius: "8px",
                            },
                        },
                    }}
                >
                    <img
                        className="image"

                        // srcSet={image}
                        src={`http://localhost:3300/${image}`}
                        alt=""
                        loading="lazy"
                    />
                </Tooltip>
            </BoxImage>
            <Dialog open={showImage} onClose={() => setShowImage(false)} maxWidth="md">
                <Close sx={{ position: "absolute", right: 10, top: 5, cursor: "pointer" }} onClick={() => setShowImage(false)} />
                <div style={{ padding: 20, textAlign: "center", marginTop: 15 }}>
                    {/* <Zoom> */}
                    <img src={`http://localhost:3300/${image}`} alt="Full Image" style={{ maxWidth: "100%", height: "auto" }} />
                    {/* </Zoom> */}

                </div>
            </Dialog>
        </>
    )
}

export default Page