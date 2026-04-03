import { Stack, TextField, Button } from "@mui/material";
import PasswordField from "./shared/PasswordField";

export default function LoginForm() {
    return (
        <Stack spacing={2}>
            <TextField label="Username" placeholder="johndoe" size="small" fullWidth />
            <PasswordField />
            <Button variant="contained" fullWidth size="large">Login</Button>
        </Stack>
    );
}