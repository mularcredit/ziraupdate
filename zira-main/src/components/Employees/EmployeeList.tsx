import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, MapPin, Mail, Phone, PrinterIcon, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import GlowButton from '../UI/GlowButton';

interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  status: 'active' | 'inactive';
  photo?: string;
  branch?: string;
}

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('all');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    status: 'active'
  });
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const addEmployeeRef = useRef<HTMLDivElement>(null);
  
  // Sample data - would come from Supabase
  const employees: Employee[] = [
    {
      id: '1',
      employee_id: 'EMP001',
      name: 'John Kariuki Mwangi',
      email: 'john.kariuki@company.co.ke',
      phone: '+254 712 345 678',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      salary: 180000,
      status: 'active',
      branch: 'Nairobi'
    },
    {
      id: '2',
      employee_id: 'EMP002',
      name: 'Mary Wanjiku Njeru',
      email: 'mary.wanjiku@company.co.ke',
      phone: '+254 722 345 678',
      department: 'Human Resources',
      position: 'HR Manager',
      salary: 150000,
      status: 'active',
      branch: 'Mombasa'
    },
    {
      id: '3',
      employee_id: 'EMP003',
      name: 'David Mwangi Kimani',
      email: 'david.mwangi@company.co.ke',
      phone: '+254 732 345 678',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 120000,
      status: 'active',
      branch: 'Nairobi'
    },
    {
      id: '4',
      employee_id: 'EMP004',
      name: 'Grace Akinyi Ochieng',
      email: 'grace.akinyi@company.co.ke',
      phone: '+254 742 345 678',
      department: 'Marketing',
      position: 'Marketing Specialist',
      salary: 100000,
      status: 'active',
      branch: 'Kisumu'
    }
  ];
  
  const departments = ['all', 'Engineering', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Sales'];
  const branches = ['all', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];
  const actions = ['import employees', 'Add Employee Login (ESS)', 'terminate employees'];
  
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesBranch = selectedBranch === 'all' || employee.branch === selectedBranch;
    return matchesSearch && matchesDepartment && matchesBranch;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setIsQuickActionsOpen(false);
      }
      if (addEmployeeRef.current && !addEmployeeRef.current.contains(event.target as Node)) {
        setIsAddEmployeeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQuickAction = (action: string) => {
    setIsQuickActionsOpen(false);
    console.log('Action selected:', action);
    // Implement your action logic here
  };

  const handleAddEmployee = () => {
    console.log('Adding employee:', newEmployee);
    // Here you would typically send the data to your backend
    setIsAddEmployeeOpen(false);
    setNewEmployee({ status: 'active' }); // Reset form
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Add Employee Modal */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            ref={addEmployeeRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
                <button 
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newEmployee.name || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder="John Kariuki Mwangi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employee_id"
                    value={newEmployee.employee_id || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder="EMP001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newEmployee.email || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder="john.kariuki@company.co.ke"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newEmployee.phone || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder="+254 712 345 678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="department"
                    value={newEmployee.department || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                  >
                    <option value="">Select Department</option>
                    {departments.filter(d => d !== 'all').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder="Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary (KSh)</label>
                  <input
                    type="number"
                    name="salary"
                    value={newEmployee.salary || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder="180000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    name="branch"
                    value={newEmployee.branch || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                  >
                    <option value="">Select Branch</option>
                    {branches.filter(b => b !== 'all').map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NHIF</label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder=""
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NSSF</label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder=""
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KRA
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder=""
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position || ''}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                    placeholder=""
                  />
                </div>
                
                
                
                
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={newEmployee.status || 'active'}
                    onChange={handleInputChange}
                    className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <GlowButton 
                  variant="secondary" 
                  onClick={() => setIsAddEmployeeOpen(false)}
                >
                  Cancel
                </GlowButton>
                <GlowButton 
                  onClick={handleAddEmployee}
                  icon={Plus}
                >
                  Add Employee
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage your workforce with comprehensive employee records</p>
        </div>
        <div className='flex space-x-3'>
          <GlowButton 
            icon={Plus} 
            onClick={() => setIsAddEmployeeOpen(true)}
          >
            Add Employee
          </GlowButton>
          
          {/* Quick Actions Dropdown */}
          <div className="relative" ref={quickActionsRef}>
            <GlowButton 
              icon={ChevronDown} 
              iconPosition="right"
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center"
            >
              Quick Actions
            </GlowButton>
            
            {isQuickActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  {actions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white/80 text-sm backdrop-blur-sm border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[42px] bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
            />
          </div>
          
          {/* Department Dropdown */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
          >
            {departments.map(dept => (
              <option key={dept} value={dept} className="bg-white">
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          
          {/* Branch Dropdown */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
          >
            {branches.map(branch => (
              <option key={branch} value={branch} className="bg-white">
                {branch === 'all' ? 'All Branches' : branch}
              </option>
            ))}
          </select>
          
          {/* Employment Type Dropdown */}
          <select
            value={selectedEmploymentType}
            onChange={(e) => setSelectedEmploymentType(e.target.value)}
            className="h-[42px] bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200"
          >
            <option value="all">Employment Types</option>
            <option value="Fulltime">Fulltime</option>
            <option value="Intern">Intern</option>
            <option value="Probationary">Probationary</option>
            <option value="Casual">Casual</option>
            <option value="Consultant">Consultant</option>
            <option value="Contract">Contract</option>
          </select>
          
          {/* Buttons - moved to a new row on smaller screens */}
          <div className="flex  space-x-2 h-[42px] md:col-span-5 lg:col-span-1">
            <GlowButton variant="secondary" icon={Filter} size="sm" className="h-full">
              Filters
            </GlowButton>
            <GlowButton variant="secondary" icon={Download} size="sm" className="h-full">
              Export
            </GlowButton>
            
            <GlowButton variant="secondary" icon={PrinterIcon} size="sm" className="h-full">
              Print
            </GlowButton>
          </div>
        </div>
      </div>
      
      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee, index) => (
          <motion.div
            key={employee.id}
            className="bg-white backdrop-blur-sm border border-gray-200 rounded-lg p-6 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-500/30">
                  {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">{employee.name}</h3>
                  <p className="text-gray-600 text-sm">{employee.employee_id}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                employee.status === 'active' 
                  ? 'bg-green-500/20 text-green-800 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {employee.status}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-green-800" />
                <span className="text-gray-700">{employee.department} • {employee.branch}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">{employee.position}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-green-800" />
                <span className="text-gray-700 truncate">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-green-800" />
                <span className="text-gray-700">{employee.phone}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Salary: </span>
                <span className="text-green-800 font-semibold">
                  KSh {employee.salary.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <GlowButton variant="secondary" size="sm" icon={Eye}>
                View
              </GlowButton>
              <GlowButton variant="secondary" size="sm" icon={Edit}>
                Edit
              </GlowButton>
              <GlowButton variant="danger" size="sm" icon={Trash2}>
                Delete
              </GlowButton>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No employees found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new employee.</p>
        </div>
      )}
    </div>
  );
}