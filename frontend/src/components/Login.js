import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUserGraduate, FaUserCog } from 'react-icons/fa';
import { saveToken, isTokenValid } from '../utils/tokenManager';
import api from '../utils/axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');

    useEffect(() => {
        if (isTokenValid()) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'student') {
                navigate('/student-dashboard');
            } else if (user?.role === 'admin') {
                navigate('/admin-dashboard');
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('http://localhost:5000/api/auth/login', {
                ...formData,
                role: selectedRole
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            if (response.data.user.role === 'student') {
                navigate('/student-dashboard');
            } else if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome Back</h1>
                                    <p className="text-gray-500">Sign in to your account</p>
                                </div>

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}

                                <div className="flex justify-center space-x-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole('student')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                            selectedRole === 'student'
                                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <FaUserGraduate />
                                        <span>Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole('admin')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                            selectedRole === 'admin'
                                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <FaUserCog />
                                        <span>Admin</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                                loading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {loading ? 'Signing in...' : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
                                        </button>
                                    </div>

                                    <div className="text-sm text-center text-gray-600">
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                            Sign up
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;