import { useState } from 'react';
import { signUp } from '../api/auth.api.ts';
import SignupForm from "../components/SignupForm.tsx";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        try {
            await signUp(email, password);
            window.location.href = "/login";
        } catch (error) {
            setError('Failed to sign up. Please check your credentials and try again.');
        }
    };

    return (
        <SignupForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            error={error}
            handleSubmit={handleSubmit}
        />
    );
}