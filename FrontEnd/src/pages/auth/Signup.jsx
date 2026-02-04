import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Auth.css';

export function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-subtitle">Start your 14-day free trial</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Enter your name"
                            icon={User}
                            value={formData.name}
                            onChange={handleChange('name')}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange('email')}
                            required
                        />

                        <Input
                            label="Company Name"
                            type="text"
                            placeholder="Enter your company name"
                            icon={Building}
                            value={formData.company}
                            onChange={handleChange('company')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            icon={Lock}
                            value={formData.password}
                            onChange={handleChange('password')}
                            hint="Minimum 8 characters"
                            required
                        />

                        <Button type="submit" fullWidth loading={loading} icon={ArrowRight} iconPosition="right">
                            Create Account
                        </Button>
                    </form>

                    <p className="auth-terms">
                        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </p>

                    <div className="auth-footer">
                        <span>Already have an account?</span>
                        <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
