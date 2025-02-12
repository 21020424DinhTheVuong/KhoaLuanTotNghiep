import { Controller, useForm } from "react-hook-form"
import { AddPhotoAlternate, CloudUpload } from "@mui/icons-material"
import {
    Box, Button, List,
    Modal, TextField, InputLabel,
    FormControl, Select, MenuItem, SelectChangeEvent, Typography, styled, FormHelperText, Tooltip, InputAdornment
} from "@mui/material"
import { useState } from "react";
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
interface ChapterInfor {
    book_id: number;
    chapters: number;
    book_name: string;
}

interface FormValues {
    title: string;
    chapter_number: number;
    pages: string[]
    // image_url: any
}
const AddChapter = ({ book_id, chapters, book_name }: ChapterInfor) => {
    // console.log(book_name)
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [chapterName, setChapterName] = useState<string>('')

    const [fileName, setFileName] = useState<string[]>([]);
    const [files, setFile] = useState<any>(null)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: any = event.target.files?.[0]; // Get the first file selected
        if (file) {
            setFileName([...fileName, file.name]); // Set the file name to state
        }
        setFile(file)
    };
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            chapter_number: chapters + 1
        }
    });
    const onSubmit = async (data: FormValues) => {
        if (!data.pages || data.pages.length === 0) {
            alert("Cần có ảnh!");
            return;
        }
        const formData = new FormData();


        // Example bookName and chapterNumber (replace with actual values)
        formData.append("bookId", String(book_id))
        formData.append("bookName", String(book_name));
        formData.append("title", data.title)
        formData.append("chapterNumber", String(data.chapter_number));
        for (let i = 0; i < data.pages.length; i++) {
            formData.append("images", data.pages[i]); // 'images' must match backend field name
        }
        try {
            const response = await apiClient.post("add-chapter", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });            // console.log(response);
            if (window.confirm(response.data.message)) {
                window.location.reload()
            }
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}:`, value);
            // }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    return (
        <Box>
            <Button variant="outlined" startIcon={<AddPhotoAlternate />} onClick={() => { handleOpen() }}>Thêm chương</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h5">Thêm chương</Typography>

                    <List sx={{ marginBottom: 2 }}>
                        <FormControlCustom onSubmit={handleSubmit(onSubmit)} noValidate >
                            <FormControl fullWidth variant="standard" error={!!errors.title} >
                                <TextField
                                    sx={{ width: 400 }}
                                    variant="standard"
                                    type="description"
                                    multiline
                                    label="Tên chương"
                                    {...register('title', {
                                        required: ("Không được trống!")
                                    })}
                                />
                            </FormControl>

                            <FormControl fullWidth variant="standard" error={!!errors.chapter_number} sx={{ marginTop: 2 }}>
                                <TextField
                                    sx={{ width: 400 }}
                                    type="number"
                                    variant="standard"
                                    label="Số chương"
                                    // placeholder={`Mới nhất: ${chapters}`}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{ opacity: 0.6 }}>Mới nhất: {chapters}</InputAdornment>,
                                    }}
                                    // inputProps={{ sx: { textAlign: "left", "&::placeholder": { textAlign: "right" } } }}
                                    {...register('chapter_number', {
                                        required: 'Không được trống!',
                                    })}
                                />
                                {errors.chapter_number && <FormHelperText>{errors.chapter_number.message}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth margin="normal" >
                                {/* 
                                <Button
                                    component="label"
                                    // role={undefined}
                                    variant="outlined"
                                    tabIndex={-1}
                                    startIcon={<CloudUpload />}
                                >
                                    Tải ảnh lên
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>

                                {fileName && <Typography>{fileName}</Typography>} */}
                                <Controller
                                    name="pages"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => field.onChange(e.target.files)}
                                        />
                                    )}
                                />

                            </FormControl>
                            <Button type="submit" variant="contained" sx={{ marginTop: 5 }}>Xong</Button>

                        </FormControlCustom>
                    </List>
                </Box>
            </Modal>
        </Box>
    )
}

export default AddChapter