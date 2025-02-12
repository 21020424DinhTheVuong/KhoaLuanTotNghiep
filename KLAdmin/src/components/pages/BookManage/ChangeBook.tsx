import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Edit, CloudUpload, Close } from "@mui/icons-material";
import {
    Box, Button, List,
    Modal, TextField,
    FormControl, Typography,
    styled, FormHelperText,
    FormLabel, RadioGroup,
    FormControlLabel, Radio,
    Select, SelectChangeEvent, OutlinedInput, MenuItem, InputLabel
} from "@mui/material"
import apiClient from "../../constants/apiClient";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
};
const statuses = ["Hoàn thành", "Đang tiến hành"]
const FormControlCustom = styled("form")({
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
})
interface GenreInterface {
    // id: number;
    type: string
}
interface GenreInterface {
    id: number;
    type: string;
}
interface FormValues {
    name: string,
    other_name: string,
    artist: string,
    status: string,
    nation: string;
    description: string,
    genre: GenreInterface[]
}

interface ChangeInterface {
    id_change: number,
    book_name_change: string,
    other_name_change: string,
    nation_change: string;
    genre_change: GenreInterface[];
    artist: string,
    status_change: string,
    description_change: string,
    cover_change: string
}

const ChangeBook: React.FC<ChangeInterface> = ({ id_change, book_name_change, other_name_change, genre_change, nation_change, artist, status_change, description_change, cover_change }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => { setOpen(true); getAllGenre() };
    const handleClose = () => setOpen(false);
    const [allGenre, setAllGenre] = useState<GenreInterface[]>([])
    const getAllGenre = async () => {
        try {
            const response = await apiClient.get("get-all-genres")
            setAllGenre(response.data)
        } catch (error) {

        }
    }
    const [bookGenre, setBookGenre] = useState<GenreInterface[]>(genre_change)
    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const selectedIds = event.target.value as string[];

        setBookGenre((prevGenres) => {
            const updatedGenres = allGenre.filter((genre) =>
                selectedIds.includes(genre.id.toString())
            );
            return updatedGenres;
        });
    };

    const [nation, setNation] = useState<string>(nation_change)
    const [fileName, setFileName] = useState('')
    const [file, setFile] = useState<any>(null)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: any = event.target.files?.[0]; // Get the first file selected
        if (file) {
            setFileName(file.name); // Set the file name to state
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
            name: book_name_change,
            other_name: other_name_change,
            artist: artist,
            status: status_change,
            nation: nation_change,
            description: description_change,
            genre: bookGenre
            // image_url: image_url_change
        }
    });
    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        formData.append("book_name", data.name);
        formData.append("other_name", data.other_name)
        formData.append("artist", data.artist);
        formData.append("nation", data.nation)
        formData.append("status", data.status);
        formData.append("description", data.description)
        if (file) {
            formData.append("cover_image", file)
        }

        try {
            const response = await apiClient.patch(`change-book/${id_change}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            if (window.confirm("Sửa thành công")) {
                window.location.reload();
            }
            // console.log(response.data)
            // console.log(data, file)
        } catch (error) {
            console.log(error)
        }
    };
    return (
        <Box>
            <Button variant="outlined" startIcon={<Edit />} onClick={() => { handleOpen() }}>Sửa thông tin</Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h5">Thông tin</Typography>

                    <List sx={{ marginBottom: 2 }}>
                        <FormControlCustom onSubmit={handleSubmit(onSubmit)} noValidate >
                            <FormControl fullWidth variant="standard" error={!!errors.name} style={{ marginBottom: 10 }}>
                                <TextField
                                    disabled
                                    variant="standard"
                                    label="Tên sách"
                                    {...register('name', {
                                        required: 'Không được để trống',
                                    })}
                                />
                                {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth variant="standard" error={!!errors.other_name} style={{ marginBottom: 10 }}>
                                <TextField
                                    variant="standard"
                                    label="Tên khác"
                                    {...register('other_name')}
                                />
                            </FormControl>
                            <FormControl fullWidth variant="standard" error={!!errors.artist} style={{ marginBottom: 10 }}>
                                <TextField
                                    variant="standard"
                                    label="Tác giả"
                                    {...register('artist', {
                                        required: 'Không được để trống'
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
                                                "& .MuiSelect-select": { color: "white" },
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Quốc gia
                                            </MenuItem>
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
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple
                                    displayEmpty
                                    disabled
                                    value={bookGenre.map(bg => bg.id.toString())} // Convert ids to string for Select
                                    onChange={handleChange}

                                >
                                    {allGenre.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >
                                            {item.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label" style={{ marginTop: 15, fontSize: 14 }}>Trạng thái</FormLabel>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup {...field} row>
                                            <FormControlLabel value="Hoàn thành" control={<Radio />} label="Hoàn thành" />
                                            <FormControlLabel value="Đang tiến hành" control={<Radio />} label="Đang tiến hành" />
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={!!errors.description}>
                                <TextField
                                    variant="standard"
                                    type="description"
                                    rows={5}
                                    multiline
                                    label="Mô tả"
                                    {...register('description', {
                                        required: 'Cần có mô tả',
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
                                    Đổi ảnh bìa
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    {fileName && <Typography>{fileName}</Typography>}
                                    {fileName &&
                                        <Close onClick={() => { setFile(null); setFileName('') }} style={{ cursor: "pointer" }} />
                                    }
                                </Box>

                            </FormControl>
                            <Button type="submit" variant="contained" sx={{ marginTop: 0 }}>Xong</Button>

                        </FormControlCustom>
                    </List>
                </Box>
            </Modal >
        </Box >
    )
}

export default ChangeBook