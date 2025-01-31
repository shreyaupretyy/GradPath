import React, { useState, useEffect } from 'react';
import { Search, Download, Users, Edit, Trash, Eye, X, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function StudentsPage({ darkMode }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    university: '',
    be_percentage: '',
    be_ranking: '',
    location: '',
  });

  // Fetch students from the backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students/');
      setStudents(response.data);
      console.log("Fetched students successfully.");
    } catch (error) {
      toast.error('Failed to fetch students');
      console.log("Error fetching students:", error);
    }
  };

  // Handles editing an existing student
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setEditForm(student);
    setShowModal(true);
  };

  // Handles deleting a student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/api/students/${studentId}`);
        setStudents(students.filter(student => student.id !== studentId));
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Failed to delete student');
        console.log("Error deleting student:", error);
      }
    }
  };

  // Saves changes (creating or editing a student)
  const handleSaveStudent = async () => {
    if (selectedStudent) {
      // Update existing student
      try {
        const response = await axios.put(`/api/students/${selectedStudent.id}`, editForm);
        setStudents(students.map(student => 
          student.id === selectedStudent.id ? response.data : student
        ));
        toast.success('Student updated successfully');
      } catch (error) {
        toast.error('Failed to update student');
        console.log("Error updating student:", error);
      }
    } else {
      // Add new student
      try {
        const response = await axios.post('/api/students/', editForm);
        setStudents([...students, response.data]);
        toast.success('New student added successfully');
      } catch (error) {
        toast.error('Failed to add student');
        console.log("Error adding student:", error);
      }
    }
    setShowModal(false);
    setSelectedStudent(null);
    setEditForm({
      name: '',
      email: '',
      university: '',
      be_percentage: '',
      be_ranking: '',
      location: '',
    });
  };

  // Exports the table data to CSV
  const handleExportData = () => {
    const headers = ['ID', 'Name', 'Email', 'University', 'BE Percentage', 'BE Ranking', 'Status', 'Location'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => Object.values(student).join(',')),
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

  // Filters students by search term and status
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header with gradient to match dashboard */}
      <div className="mb-6 rounded-lg shadow-md p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h2 className="text-2xl font-bold">Students</h2>
      </div>

      {/* Search and actions */}
      <div className={`mb-6 shadow-md p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              />
              <input
                type="text"
                placeholder="Search students..."
                className={`pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setSelectedStudent(null);
                setEditForm({
                  name: '',
                  email: '',
                  university: '',
                  be_percentage: '',
                  be_ranking: '',
                  location: '',
                });
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </button>
            <button
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Students table */}
      <div className={`shadow-md overflow-hidden rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  Student Details
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  Academic Info
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredStudents.map((student) => (
                <tr key={student.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-blue-100'} flex items-center justify-center`}>
                        <span className={`${darkMode ? 'text-white' : 'text-blue-600'} font-medium`}>{student.name?.[0]}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{student.name}</div>
                        <div className="text-sm opacity-70">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{student.university}</div>
                    <div className="text-sm opacity-70">
                      BE: {student.be_percentage}% | Rank: {student.be_ranking}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1">
                      <span className="text-sm opacity-70">Current:</span>
                      <span className="text-sm font-semibold capitalize">{student.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => toast.info(`Viewing ${student.name}`)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-yellow-50 dark:hover:bg-gray-700"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-full max-w-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div
              className={`flex justify-between items-center mb-4 ${
                darkMode ? 'border-b border-gray-700 pb-3' : ''
              }`}
            >
              <h3 className="text-xl font-bold">{selectedStudent ? 'Edit Student' : 'Add Student'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">University</label>
                <input
                  type="text"
                  value={editForm.university}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                  className={`w-full px-3 py-2 rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">BE Percentage</label>
                  <input
                    type="number"
                    value={editForm.be_percentage}
                    onChange={(e) => setEditForm({ ...editForm, be_percentage: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">BE Ranking</label>
                  <input
                    type="number"
                    value={editForm.be_ranking}
                    onChange={(e) => setEditForm({ ...editForm, be_ranking: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className={`w-full px-3 py-2 rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                  }`}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStudent}
                className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} px-4 py-2 rounded-md text-white`}
              >
                {selectedStudent ? 'Update' : 'Add'} Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}