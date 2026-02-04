import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Auth.css';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="auth-logo-icon">S</div>
                            <span className="auth-logo-text">SupportDesk</span>
                        </div>
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to your account to continue</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="auth-options">
                            <label className="auth-remember">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="auth-forgot">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" fullWidth loading={loading} icon={ArrowRight} iconPosition="right">
                            Sign In
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <span>Don't have an account?</span>
                        <Link to="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
