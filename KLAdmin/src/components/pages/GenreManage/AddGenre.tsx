import { useState } from "react"
import { useForm } from "react-hook-form"
import { Add, CloudUpload } from "@mui/icons-material";
import {
    Box, Button, List,
    Modal, TextField, InputLabel,
    FormControl, Select, MenuItem, SelectChangeEvent, Typography, styled, FormHelperText, Tooltip
} from "@mui/material"
import apiClient from "../../constants/apiClient";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
};
const statuses = ["None", "Sale", "Bundle", "Group"]
const FormControlCustom = styled("form")({
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
})

interface FormValues {
    type: string;
    describe: string
    // image_url: any
}
const AddGenre: React.FC = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();
    const onSubmit = async (data: FormValues) => {
        try {
            const response = await apiClient.post("add-genre", {
                type: data.type,
                describe: data.describe
            })
            if (window.confirm("Thêm thành công!")) {
                window.location.reload()
            }
        } catch (error) {
            console.error('Error adding genre:', error);
            alert("Thể loại này đã có rồi!")
        }
    };
    return (
        <Box>
            <Button variant="contained" startIcon={<Add />} onClick={() => { handleOpen() }}>Thêm thể loại</Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h5">Thể loại</Typography>

                    <List sx={{ marginBottom: 2 }}>
                        <FormControlCustom onSubmit={handleSubmit(onSubmit)} noValidate >
                            <FormControl fullWidth variant="standard" error={!!errors.type}>
                                <TextField
                                    sx={{ width: 400 }}
                                    variant="standard"
                                    label="Thể loại"
                                    {...register('type', {
                                        required: 'Không được trống!',
                                    })}
                                />
                                {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={!!errors.describe}>
                                <TextField
                                    sx={{ width: 400 }}
                                    variant="standard"
                                    type="description"
                                    multiline
                                    label="Mô tả"
                                    {...register('describe', {
                                        required: 'Không được trống!',
                                    })}
                                />
                                {errors.describe && <FormHelperText>{errors.describe.message}</FormHelperText>}
                            </FormControl>

                            <Button type="submit" variant="contained" sx={{ marginTop: 5 }}>Xong</Button>

                        </FormControlCustom>
                    </List>
                </Box>
            </Modal>
        </Box>
    )
}

export default AddGenre