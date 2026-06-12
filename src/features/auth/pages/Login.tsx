import { useState } from "react";
import { signIn } from "../api/auth.api.ts";
import LoginForm from "../components/LoginForm.tsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      window.location.href = "/overview";
    } catch (error) {
      setError(
        "Failed to sign in. Please check your credentials and try again.",
      );
    }
  };

  return (
    <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={error} handleSubmit={handleSubmit} />
  );
}
