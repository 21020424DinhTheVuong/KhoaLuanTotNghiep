import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Add, Close, CloudUpload } from "@mui/icons-material";
import {
    Box, Button, List,
    Modal, TextField, InputLabel,
    FormControl, Select, MenuItem, SelectChangeEvent, Typography, styled, FormHelperText, Tooltip
} from "@mui/material"
import apiClient from "../../constants/apiClient";
import { error } from "console";

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
    book_name: string;
    other_name?: string;
    artist: string;
    nation: string;
    genre: string[];
    description: string;
    cover_image: any
}
interface GenreInterface {
    id: number;
    type: string;
}
const names = [
    'Action', "Adventure", "Comedy", "Sci-fic", "Romance"
];
const AddBook: React.FC = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [allGenre, setAllGenre] = useState<GenreInterface[]>([])

    const getAllGenre = async () => {
        try {
            const response = await apiClient.get("get-all-genres")
            setAllGenre(response.data)
        } catch (error) {

        }
    }
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        defaultValues: {
            nation: "Nhật Bản"
        }
    });
    const [preview, setPreview] = useState<string | null>(null);

    const [fileName, setFileName] = useState<string>("");
    const [file, setFile] = useState<any>(null)
    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file: any = event.target.files?.[0]; // Get the first file selected
    //     if (file) {
    //         setFileName(file.name); // Set the file name to state
    //     }
    //     setFile(file)
    // };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setValue("cover_image", file); // Manually update React Hook Form state

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: FormValues) => {
        if (!preview) {
            window.alert("Cần thêm ảnh");
            return;
        }
        const formData = new FormData();
        formData.append("book_name", data.book_name);
        formData.append("other_name", data.other_name || "");
        formData.append("artist", data.artist);
        formData.append("nation", data.nation);
        formData.append("description", data.description);
        formData.append("cover_image", data.cover_image);

        // Append genres as array
        data.genre.forEach((g) => formData.append("genre[]", g));

        try {
            const response = await apiClient.post("add-book", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (window.confirm("Thêm thành công!")) {
                window.location.reload();
            }
            // console.log(data)
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    return (
        <Box>
            <Button variant="contained" startIcon={<Add />} onClick={() => { handleOpen(); getAllGenre() }}>Thêm sách</Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <List sx={{ marginBottom: 2, }}>
                        <FormControlCustom noValidate onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth variant="standard" error={!!errors.book_name}>
                                <TextField
                                    sx={{ width: 400 }}
                                    variant="standard"
                                    label="Tên sách"
                                    {...register('book_name', {
                                        required: 'Không được trống!',
                                    })}
                                />
                                {errors.book_name && <FormHelperText>{errors.book_name.message}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth margin="normal" >
                                <TextField
                                    sx={{ width: 400 }}
                                    variant="standard"
                                    type="description"
                                    multiline
                                    label="Tên khác"
                                    {...register('other_name')}
                                />
                            </FormControl>
                            <FormControl fullWidth variant="standard" error={!!errors.artist}>
                                <TextField
                                    sx={{ width: 400 }}
                                    variant="standard"
                                    label="Tác giả"
                                    {...register('artist', {
                                        required: 'Không được trống!',
                                    })}
                                />
                                {errors.artist && <FormHelperText>{errors.artist.message}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth variant="standard" error={!!errors.nation} style={{ marginBottom: 10 }}>
                                <Controller
                                    name="nation"
                                    control={control}
                                    rules={{ required: "Không được trống" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            displayEmpty
                                            sx={{
                                                marginTop: 3,
                                                // "& .MuiSelect-select": { color: "white" },
                                            }}
                                        >
                                            <MenuItem value="Nhật Bản">Nhật Bản</MenuItem>
                                            <MenuItem value="Mỹ">Mỹ</MenuItem>
                                            <MenuItem value="Hàn Quốc">Hàn Quốc</MenuItem>
                                            <MenuItem value="Việt Nam">Việt Nam</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.nation && <FormHelperText>{errors.nation.message}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth variant="standard" sx={{ maxWidth: "700px" }}>
                                <InputLabel id="demo-controlled-open-select-label">Thể loại</InputLabel>
                                <Controller
                                    name="genre"
                                    control={control}
                                    defaultValue={[]} // Default as empty array for multiple selection
                                    rules={{ required: "Vui lòng chọn thể loại" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            multiple
                                            displayEmpty
                                            onChange={(event) => field.onChange(event.target.value)}
                                        >
                                            {allGenre.map((item) => (
                                                <MenuItem key={item.id} value={item.id.toString()}>
                                                    {item.type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.genre && <FormHelperText>{errors.genre.message}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth variant="standard" error={!!errors.description} sx={{ marginTop: 2 }}>
                                <TextField
                                    sx={{ width: 400 }}
                                    variant="standard"
                                    multiline
                                    maxRows={4}
                                    label="Mô tả"
                                    {...register('description', {
                                        required: 'Không được trống!',
                                    })}
                                />
                                {errors.description && <FormHelperText>{errors.description.message}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth margin="normal" >

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
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>

                                {preview &&
                                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <img src={preview} alt="Preview" style={{ width: 150, height: 150, objectFit: "cover" }} />
                                        <Close onClick={() => { setPreview(null) }} sx={{ cursor: "pointer" }} />
                                    </Box>
                                }

                            </FormControl>
                            <Button type="submit" variant="contained" sx={{ marginTop: 5 }}
                            >Xong</Button>

                        </FormControlCustom>
                    </List>
                </Box>
            </Modal>
        </Box>
    )
}

export default AddBook