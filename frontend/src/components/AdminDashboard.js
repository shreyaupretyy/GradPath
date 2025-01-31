// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Bell, 
    FileText, 
    Download, 
    Settings, 
    Users, 
    LogOut, 
    ChevronDown, 
    Eye, 
    Edit, 
    Trash, 
    X, 
    Mail 
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New student registration", read: false, time: "2 hours ago" },
        { id: 2, text: "Status update pending", read: false, time: "1 day ago" },
    ]);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        darkMode: false,
        autoApprove: false,
    });

    const navigate = useNavigate();

    // Stats for the summary cards
    const [stats, setStats] = useState({
        total_students: 0,
        status_counts: {},
        recent_applications: []
    });

    // Edit form for adding/updating a student
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        university: '',
        be_percentage: '',
        be_ranking: '',
        location: '',
    });

    useEffect(() => {
        fetchStudents();
        fetchStats();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            setEditForm({
                name: selectedStudent.name,
                email: selectedStudent.email,
                university: selectedStudent.university,
                be_percentage: selectedStudent.be_percentage,
                be_ranking: selectedStudent.be_ranking,
                location: selectedStudent.location,
            });
        }
    }, [selectedStudent]);

    // Fetch all students from the backend
    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Removed token-based authentication
            const response = await axios.get('/admin/students');
            setStudents(response.data);
        } catch (error) {
            toast.error('Failed to fetch students');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch dashboard statistics
    const fetchStats = async () => {
        try {
            // Removed token-based authentication
            const response = await axios.get('/admin/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            toast.error('Failed to fetch dashboard statistics');
            console.error(error);
        }
    };

    // Logout handler
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Removed token removal since authentication is no longer used
            localStorage.removeItem('user');
            navigate('/login');
            toast.info('Logged out successfully');
        }
    };

    // Handles updating a student's status
    const handleStatusChange = async (studentId, newStatus) => {
        try {
            // Removed token-based authentication
            await axios.put(`/admin/student/${studentId}/status`, { status: newStatus });
            // Update local state
            setStudents(students.map(student =>
                student.id === studentId ? { ...student, status: newStatus } : student
            ));
            toast.success(`Student status updated to ${newStatus}`);
            addNotification(`Student #${studentId} status changed to ${newStatus}`);
            fetchStats(); // Refresh stats
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    // Handles deleting a student
    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                // Removed token-based authentication
                await axios.delete(`/admin/student/${studentId}`);
                setStudents(students.filter(student => student.id !== studentId));
                toast.success('Student deleted successfully');
                addNotification(`Student #${studentId} has been deleted`);
                fetchStats(); // Refresh stats
            } catch (error) {
                toast.error('Failed to delete student');
                console.error(error);
            }
        }
    };

    // Opens edit modal for selected student
    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    // Opens view details modal (optional implementation)
    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        // Implement a separate modal or navigation to a detailed view
        toast.info('View student details feature coming soon!');
    };

    // Exports data to CSV
    const handleExportData = () => {
        const headers = ['ID', 'Name', 'Email', 'University', 'BE Percentage', 'BE Ranking', 'Status', 'Location'];
        const csvContent = [
            headers.join(','), // header row first
            ...students.map(student => 
                [
                    student.id, 
                    `"${student.name}"`, 
                    `"${student.email}"`, 
                    `"${student.university}"`,
                    student.be_percentage, 
                    student.be_ranking, 
                    student.status, 
                    `"${student.location}"`
                ].join(',')
            ),
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_data_${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Data exported successfully');
    };

    // Saves student, either updating existing or adding new
    const handleSaveStudent = async () => {
        if (!editForm.name || !editForm.email) {
            toast.error('Name and Email are required');
            return;
        }

        try {
            if (selectedStudent) {
                // Update existing student
                await axios.put(`/admin/student/${selectedStudent.id}`, editForm);
                setStudents(students.map(student =>
                    student.id === selectedStudent.id ? { ...student, ...editForm } : student
                ));
                toast.success('Student updated successfully');
            } else {
                // Add new student
                await axios.post('/admin/student', editForm);
                toast.success('New student added successfully');
                fetchStudents();
            }
            setShowModal(false);
            setSelectedStudent(null);
            fetchStats(); // Refresh stats
        } catch (error) {
            toast.error('Failed to save student');
            console.error(error);
        }
    };

    // Adds a notification to the list
    const addNotification = (text) => {
        const newNotification = {
            id: notifications.length + 1,
            text,
            read: false,
            time: 'Just now'
        };
        setNotifications([newNotification, ...notifications]);
    };

    // Marks a notification as read
    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    // Toggles a setting on/off
    const handleSettingChange = (setting) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
        toast.success(`${setting} setting updated`);
    };

    // Clears all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
        toast.success('All notifications cleared');
    };

    // Sends a test email
    const sendTestEmail = () => {
        toast.info('Test email sent to admin');
    };

    // Filtered students based on searchTerm and statusFilter
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.university.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <div className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
                {/* Sidebar Toggle Button (handled by Layout) */}
                {/* You can remove this button if the Layout handles sidebar toggling */}
                <button
                    onClick={() => {}}
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                    title="Sidebar Toggle"
                    disabled
                >
                    <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-4">
                    {/* Add any additional top navigation items here */}
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Dashboard Content Area */}
            <div className="p-6">
                {/* Stats Cards with Gradient */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-xl shadow-lg">
                        <div className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center`}>
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total_students}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-1 rounded-xl shadow-lg">
                        <div className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center`}>
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Pending Review</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.status_counts.pending || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-1 rounded-xl shadow-lg">
                        <div className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center`}>
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.status_counts.approved || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-1 rounded-xl shadow-lg">
                        <div className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center`}>
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Rejected</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.status_counts.rejected || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters Section */}
                <div className="mb-6 bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => { setShowModal(true); setSelectedStudent(null); }}
                                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-md transition-shadow"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Add Student
                            </button>
                            <button 
                                onClick={handleExportData}
                                className="inline-flex items-center px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Student Details</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Academic Info</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {student.name?.[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {student.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {student.university}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                BE: {student.be_percentage}% | Rank: {student.be_ranking}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Location: {student.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={student.status}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                className={`px-3 py-1 text-sm rounded-full cursor-pointer ${
                                                    student.status === "approved" ? "bg-green-100 text-green-800" :
                                                    student.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleViewStudent(student)}
                                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditStudent(student)}
                                                    className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-yellow-100"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loading && <p className="p-4 text-center">Loading...</p>}
                        {!loading && filteredStudents.length === 0 && <p className="p-4 text-center">No students found.</p>}
                    </div>
                </div>
            </div>

            {/* Student Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-2xl -m-6 p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    {selectedStudent ? 'Edit Student' : 'Add Student'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white hover:text-gray-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">University</label>
                                <input
                                    type="text"
                                    value={editForm.university}
                                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">BE Percentage</label>
                                    <input
                                        type="number"
                                        value={editForm.be_percentage}
                                        onChange={(e) => setEditForm({ ...editForm, be_percentage: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">BE Ranking</label>
                                    <input
                                        type="number"
                                        value={editForm.be_ranking}
                                        onChange={(e) => setEditForm({ ...editForm, be_ranking: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveStudent}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {selectedStudent ? 'Update' : 'Add'} Student
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Settings</h2>
                            <button
                                onClick={() => setShowSettingsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Email Notifications</span>
                                <button
                                    onClick={() => handleSettingChange('emailNotifications')}
                                    className={`${
                                        settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                                >
                                    <span
                                        className={`${
                                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Dark Mode</span>
                                <button
                                    onClick={() => handleSettingChange('darkMode')}
                                    className={`${
                                        settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                                >
                                    <span
                                        className={`${
                                            settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Auto-approve Students</span>
                                <button
                                    onClick={() => handleSettingChange('autoApprove')}
                                    className={`${
                                        settings.autoApprove ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                                >
                                    <span
                                        className={`${
                                            settings.autoApprove ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                                    />
                                </button>
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={sendTestEmail}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Test Email
                                </button>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowSettingsModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}