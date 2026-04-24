import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Typography, Box, Autocomplete } from "@mui/material";
import FormDialog from "../common/FormDialog";
import useDebounce from "../Hooks/useDebounce";
import useFetch from "../Hooks/useFetch";
import axios from "axios";
import { schema } from "./validationScema";
import { yupResolver } from "@hookform/resolvers/yup";

export default function StudentForm({ onSubmitData }) {
    const { control, handleSubmit, setValue, reset } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            project: null
        }
    });

    const inputStyles = {
        backgroundColor: "#f8fafc",
        borderRadius: 10,
    };

    const [colleges, setColleges] = useState([]);
    const [degrees, setDegrees] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                const [colleges, degrees] = await Promise.all([
                    axios.get("http://localhost:3000/colleges", { signal: controller.signal }),
                    axios.get("http://localhost:3000/degrees", { signal: controller.signal })
                ]);

                setColleges(colleges.data);
                setDegrees(degrees.data);
            } catch (err) {
                if (axios.isCancel(err)) return;
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, []);

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    const onSubmit = (data) => {
        onSubmitData(data)
        reset()
    };

    return (
        <Box sx={{ width: "100%", p: 5, borderRadius: 4, border: "1px solid rgba(148,163,184,0.35)", backgroundColor: "#ffffff", boxShadow: "0 24px 80px rgba(15,23,42,0.08)" }} >
            <Typography variant='h4' sx={{ textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>
                Provide The Details To Build Resume
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} direction='column'>
                    <Grid item xs={12}>
                        <Controller
                            name="fullName"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Full Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} sx={inputStyles} />
                            )}

                        />
                    </Grid>


                    <Grid item xs={12}>
                        <Controller
                            name="schoolName"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="School Name" fullWidth sx={inputStyles} />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="schoolPercentage"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="School Percentage" fullWidth sx={inputStyles} />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="twelthCollege"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField {...field} label="12th College" fullWidth sx={inputStyles} />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="twelthPercentage"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField {...field} label="12th Percentage" fullWidth sx={inputStyles} />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="degree"
                            control={control}
                            defaultValue={null}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={degrees}
                                    value={field.value}

                                    getOptionLabel={(option) => option?.name || ""}

                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }

                                    onChange={(event, value) => {
                                        console.log(value)
                                        field.onChange(value); // store full object
                                    }}

                                    renderInput={(params) => (
                                        <TextField {...params} label="Degree" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} sx={inputStyles} />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="degreeCollege"
                            control={control}
                            defaultValue={null}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={colleges}
                                    value={field.value}

                                    getOptionLabel={(option) => option?.name || ""}

                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }

                                    onChange={(event, value) => {
                                        return field.onChange(value); // store full object
                                    }}

                                    renderInput={(params) => (
                                        <TextField {...params} label="College" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} sx={inputStyles} />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Email" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} sx={inputStyles} />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Phone" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} sx={inputStyles} />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="job_desc"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField {...field} label="Job Description" fullWidth sx={inputStyles} />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormDialog onSave={projectData => {
                            setValue("project", projectData, {
                                shouldDirty: true,
                                shouldValidate: true
                            })
                        }} />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Box>
    );
}