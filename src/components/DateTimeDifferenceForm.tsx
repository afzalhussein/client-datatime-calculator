import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DateTimeDifference } from '../types/datetime';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

interface DateTimeDifferenceFormProps {
    onSubmit: (data: DateTimeDifference) => void;
    loading?: boolean;
}

const DateTimeDifferenceForm: React.FC<DateTimeDifferenceFormProps> = ({
    onSubmit,
    loading = false,
}) => {
    const { control, handleSubmit } = useForm<DateTimeDifference>({
        defaultValues: {
            date1: new Date().toISOString().slice(0, 16),
            date2: new Date().toISOString().slice(0, 16),
            unit: 'days',
            timezone1: 'UTC',
            timezone2: 'UTC',
        },
    });

    const onSubmitHandler = (data: DateTimeDifference) => {
        onSubmit(data);
    };

    return (
        <form
            aria-label="Date Time Difference Form"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmitHandler)();
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                    name="date1"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="First Date"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value || ''}
                        />
                    )}
                />

                <Controller
                    name="date2"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Second Date"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value || ''}
                        />
                    )}
                />

                <FormControl fullWidth>
                    <InputLabel id="unit-select-label">Difference Unit</InputLabel>
                    <Controller
                        name="unit"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="unit-select-label"
                                id="unit-select"
                                label="Difference Unit"
                                onChange={(e) => field.onChange(e.target.value)}
                                value={field.value || 'days'}
                            >
                                <MenuItem value="years">Years</MenuItem>
                                <MenuItem value="months">Months</MenuItem>
                                <MenuItem value="weeks">Weeks</MenuItem>
                                <MenuItem value="days">Days</MenuItem>
                                <MenuItem value="hours">Hours</MenuItem>
                                <MenuItem value="minutes">Minutes</MenuItem>
                                <MenuItem value="seconds">Seconds</MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>

                <Controller
                    name="timezone1"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="First Timezone"
                            fullWidth
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value || ''}
                        />
                    )}
                />

                <Controller
                    name="timezone2"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Second Timezone"
                            fullWidth
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value || ''}
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Calculating...' : 'Calculate Difference'}
                </Button>
            </Box>
        </form>
    );
};

export default DateTimeDifferenceForm;