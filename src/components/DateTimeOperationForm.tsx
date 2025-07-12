import React from 'react';
import { useForm } from 'react-hook-form';
import { DateTimeOperation } from '../types/datetime';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

export interface DateTimeOperationFormProps {
    onSubmit: (data: DateTimeOperation) => void;
    loading?: boolean;
}

const DateTimeOperationForm: React.FC<DateTimeOperationFormProps> = ({
    onSubmit,
    loading = false
}) => {
    const { register, handleSubmit, control } = useForm<DateTimeOperation>({
        defaultValues: {
            date: new Date().toISOString().slice(0, 16),
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            operation: 'add',
            timezone: 'UTC'
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} role="form">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Date"
                    type="datetime-local"
                    {...register('date')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />

                {['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].map((field) => (
                    <TextField
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        type="number"
                        {...register(field as keyof DateTimeOperation, { valueAsNumber: true })}
                        fullWidth
                    />
                ))}

                <FormControl fullWidth>
                    <InputLabel id="operation-label">Operation</InputLabel>
                    <Select
                        labelId="operation-label"
                        label="Operation"
                        defaultValue="add"
                        {...register('operation')}
                    >
                        <MenuItem value="add">Add</MenuItem>
                        <MenuItem value="subtract">Subtract</MenuItem>
                    </Select>
                </FormControl>

                <TextField label="Timezone" {...register('timezone')} fullWidth />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Calculating...' : 'Calculate'}
                </Button>
            </Box>
        </form>
    );
};

export default DateTimeOperationForm;