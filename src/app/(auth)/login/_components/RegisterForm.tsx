import { Stack, TextField, Button } from "@mui/material";
import PasswordField from "./shared/PasswordField";

export default function RegisterForm() {
    return (
        <Stack spacing={2}>
            <TextField label="Username" placeholder="johndoe" size="small" fullWidth />
            <PasswordField />
            <PasswordField label="Confirm Password" showToggle={false}/>
            <Button variant="contained" fullWidth size="large">Create Account</Button>
        </Stack>
    );
}