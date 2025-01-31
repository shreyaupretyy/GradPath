import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
        location: '',
        bePercentage: '',
        beRanking: '',
        cv: null,
        transcript: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await axios.post('http://localhost:5000/api/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Registration failed!');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Student Registration</h2>
            
            <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border mb-4 rounded"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border mb-4 rounded"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border mb-4 rounded"
                required
            />
            <input
                type="text"
                name="university"
                placeholder="University Name"
                value={formData.university}
                onChange={handleChange}
                className="w-full p-2 border mb-4 rounded"
                required
            />
            <input
                type="text"
                name="location"
                placeholder="Current Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border mb-4 rounded"
                required
            />
            <input
                type="number"
                name="bePercentage"
                placeholder="BE Percentage"
                value={formData.bePercentage}
                onChange={handleChange}
                className="w-full p-2 border mb-4 rounded"
                required
                step="0.01"
                min="0"
                max="100"
            />
            <input
                type="number"
                name="beRanking"
                placeholder="BE Tentative Ranking"
                value={formData.beRanking}
                onChange={handleChange}
                className="w-full p-2 border mb-4 rounded"
                required
            />
            
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    CV (PDF)
                </label>
                <input
                    type="file"
                    name="cv"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                    accept=".pdf"
                    required
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Transcript (PDF)
                </label>
                <input
                    type="file"
                    name="transcript"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                    accept=".pdf"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                Register
            </button>
        </form>
    );
};

export default RegisterForm;