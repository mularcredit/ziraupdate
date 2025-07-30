import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Briefcase, 
  Building, 
  Clock, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  X, 
  Check, 
  UserPlus,
  Download 
} from 'lucide-react';
// Employee Type and Department Data
const employeeTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Intern'];
const departments = ['All Departments', 'Finance', 'HR', 'IT', 'Operations', 'Marketing', 'Sales', 'Customer Service', 'Engineering'];
const statusOptions = ['All Statuses', 'Critically Needed', 'Urgent', 'Normal', 'Future Hiring'];

// Branch Data
const branches = [
  { id: 'nairobi', name: 'Nairobi', location: 'Nairobi CBD', hiringStatus: 'Critically Needed' },
  { id: 'kisumu', name: 'Kisumu', location: 'Kisumu Central', hiringStatus: 'Urgent' },
  { id: 'eldoret', name: 'Eldoret', location: 'Eldoret Town', hiringStatus: 'Normal' },
  { id: 'mombasa', name: 'Mombasa', location: 'Mombasa Island', hiringStatus: 'Critically Needed' },
  { id: 'nakuru', name: 'Nakuru', location: 'Nakuru CBD', hiringStatus: 'Normal' },
];

// Job Position Data
const jobPositions = [
  { id: '1', title: 'Software Developer', department: 'IT', type: 'Full-time', branch: 'nairobi', status: 'Critically Needed', applications: 15 },
  { id: '2', title: 'HR Manager', department: 'HR', type: 'Full-time', branch: 'nairobi', status: 'Urgent', applications: 8 },
  { id: '3', title: 'Sales Representative', department: 'Sales', type: 'Full-time', branch: 'kisumu', status: 'Critically Needed', applications: 12 },
  { id: '4', title: 'Customer Support', department: 'Customer Service', type: 'Full-time', branch: 'eldoret', status: 'Normal', applications: 5 },
  { id: '5', title: 'Marketing Intern', department: 'Marketing', type: 'Intern', branch: 'mombasa', status: 'Normal', applications: 20 },
  { id: '6', title: 'Operations Supervisor', department: 'Operations', type: 'Full-time', branch: 'nakuru', status: 'Urgent', applications: 7 },
  { id: '7', title: 'Accountant', department: 'Finance', type: 'Full-time', branch: 'nairobi', status: 'Normal', applications: 9 },
  { id: '8', title: 'IT Support', department: 'IT', type: 'Contract', branch: 'kisumu', status: 'Critically Needed', applications: 11 },
];

// Application Data
const applications = [
  { id: '1', name: 'John Kariuki', position: 'Software Developer', branch: 'nairobi', status: 'New', date: '2023-05-15', experience: '3 years' },
  { id: '2', name: 'Mary Wanjiku', position: 'HR Manager', branch: 'nairobi', status: 'Interview', date: '2023-05-10', experience: '5 years' },
  { id: '3', name: 'David Kimani', position: 'Sales Representative', branch: 'kisumu', status: 'New', date: '2023-05-18', experience: '2 years' },
  { id: '4', name: 'Grace Akinyi', position: 'Customer Support', branch: 'eldoret', status: 'Rejected', date: '2023-05-05', experience: '1 year' },
  { id: '5', name: 'Samuel Kiptoo', position: 'Marketing Intern', branch: 'mombasa', status: 'Shortlisted', date: '2023-05-20', experience: 'Fresh graduate' },
];

const GlowButton = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  size = 'md', 
  onClick, 
  disabled = false 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger'; 
  icon?: any; 
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseClasses = "inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-300 border";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const variantClasses = {
    primary: "bg-green-50 border-green-500 text-green-600 hover:bg-green-100 hover:border-green-600 hover:text-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] focus:shadow-[0_0_25px_rgba(34,197,94,0.6)]",
    secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400",
    danger: "bg-red-50 border-red-500 text-red-600 hover:bg-red-100 hover:border-red-600 hover:text-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
  };

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusClasses = {
    'Critically Needed': 'bg-red-100 text-red-800',
    'Urgent': 'bg-orange-100 text-orange-800',
    'Normal': 'bg-blue-100 text-blue-800',
    'Future Hiring': 'bg-gray-100 text-gray-800',
    'New': 'bg-blue-100 text-blue-800',
    'Interview': 'bg-purple-100 text-purple-800',
    'Shortlisted': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
      {status}
    </span>
  );
};

export default function RecruitmentDashboard() {
  const [selectedTab, setSelectedTab] = useState('positions');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPositionModal, setShowNewPositionModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter positions based on selections
  const filteredPositions = jobPositions.filter(position => {
    const matchesBranch = selectedBranch === 'all' || position.branch === selectedBranch;
    const matchesDepartment = selectedDepartment === 'All Departments' || position.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All Statuses' || position.status === selectedStatus;
    const matchesType = selectedType === 'All Types' || position.type === selectedType;
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBranch && matchesDepartment && matchesStatus && matchesType && matchesSearch;
  });

  // Filter applications based on selections
  const filteredApplications = applications.filter(application => {
    const matchesBranch = selectedBranch === 'all' || application.branch === selectedBranch;
    const matchesPosition = selectedDepartment === 'All Departments' || 
      jobPositions.find(p => p.title === application.position)?.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All Statuses' || application.status === selectedStatus;
    const matchesSearch = application.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      application.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBranch && matchesPosition && matchesStatus && matchesSearch;
  });

  // Count positions by status
  const statusCounts = {
    'Critically Needed': jobPositions.filter(p => p.status === 'Critically Needed').length,
    'Urgent': jobPositions.filter(p => p.status === 'Urgent').length,
    'Normal': jobPositions.filter(p => p.status === 'Normal').length,
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen max-w-screen-2xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Employee Recruitment Portal</h1>
            <p className="text-gray-600 text-sm">Manage open positions, applications, and hiring needs across all branches</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <GlowButton 
              icon={UserPlus} 
              size="sm"
              onClick={() => setShowNewPositionModal(true)}
            >
              Create New Position
            </GlowButton>
            <GlowButton 
              variant="secondary"
              icon={Filter}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </GlowButton>
          </div>
        </div>
      </div>

      {/* New Position Modal */}
      {showNewPositionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Job Position</h3>
              <button 
                onClick={() => setShowNewPositionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-100 focus:border-green-500"
                  placeholder="e.g. Software Developer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-100 focus:border-green-500">
                    {departments.filter(d => d !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
                  <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-100 focus:border-green-500">
                    <option value="">Select Type</option>
                    {employeeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-100 focus:border-green-500">
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Priority</label>
                  <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-100 focus:border-green-500">
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critically Needed">Critically Needed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea 
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-100 focus:border-green-500"
                  rows={4}
                  placeholder="Enter detailed job description..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <GlowButton 
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowNewPositionModal(false)}
                >
                  Cancel
                </GlowButton>
                <GlowButton 
                  icon={Check}
                  size="sm"
                  onClick={() => {
                    alert("New position created successfully");
                    setShowNewPositionModal(false);
                  }}
                >
                  Create Position
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Branch Location</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-green-100 focus:border-green-500"
              >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-green-100 focus:border-green-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Hiring Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-green-100 focus:border-green-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Employee Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-green-100 focus:border-green-500"
              >
                <option value="All Types">All Types</option>
                {employeeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search positions or applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-100 focus:border-green-500 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('positions')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${selectedTab === 'positions' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Open Positions ({jobPositions.length})
            </button>
            <button
              onClick={() => setSelectedTab('applications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${selectedTab === 'applications' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setSelectedTab('branches')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${selectedTab === 'branches' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Branches ({branches.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Status Summary Cards */}
      {selectedTab === 'positions' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard 
            label="Critically Needed Positions" 
            value={statusCounts['Critically Needed']} 
            icon={AlertCircle} 
            color="red"
            isCount={true}
          />
          <SummaryCard 
            label="Urgent Positions" 
            value={statusCounts['Urgent']} 
            icon={Clock} 
            color="orange"
            isCount={true}
          />
          <SummaryCard 
            label="Total Open Positions" 
            value={jobPositions.length} 
            icon={Briefcase} 
            color="blue"
            isCount={true}
          />
        </div>
      )}

      {/* Content based on selected tab */}
      {selectedTab === 'positions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Open Positions</h2>
                <p className="text-gray-600 text-sm">{filteredPositions.length} positions found</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <GlowButton variant="secondary" icon={Download} size="sm">Export</GlowButton>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Position Title</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Department</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Branch</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Applications</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.map((position) => {
                  const branch = branches.find(b => b.id === position.branch);
                  return (
                    <tr key={position.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <p className="text-gray-900 font-semibold">{position.title}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{position.department}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{position.type}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{branch?.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={position.status} />
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        {position.applications}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-1">
                          <GlowButton variant="secondary" icon={Edit} size="sm">Edit</GlowButton>
                          <GlowButton variant="secondary" icon={Users} size="sm">View Apps</GlowButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'applications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Job Applications</h2>
                <p className="text-gray-600 text-sm">{filteredApplications.length} applications found</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <GlowButton variant="secondary" icon={Download} size="sm">Export</GlowButton>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Applicant</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Position</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Branch</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Experience</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date Applied</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => {
                  const branch = branches.find(b => b.id === application.branch);
                  const position = jobPositions.find(p => p.title === application.position);
                  return (
                    <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <p className="text-gray-900 font-semibold">{application.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{application.position}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{branch?.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{application.experience}</p>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700">{application.date}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-1">
                          <GlowButton variant="secondary" icon={Edit} size="sm">Review</GlowButton>
                          <GlowButton variant="secondary" icon={Briefcase} size="sm">Schedule</GlowButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'branches' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch Hiring Needs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map(branch => {
                const branchPositions = jobPositions.filter(p => p.branch === branch.id);
                const criticalPositions = branchPositions.filter(p => p.status === 'Critically Needed').length;
                const urgentPositions = branchPositions.filter(p => p.status === 'Urgent').length;
                
                return (
                  <div key={branch.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                      <StatusBadge status={branch.hiringStatus} />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{branch.location}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Open Positions:</span>
                        <span className="font-medium">{branchPositions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Critically Needed:</span>
                        <span className="font-medium">{criticalPositions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-600">Urgent Positions:</span>
                        <span className="font-medium">{urgentPositions}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                      <GlowButton variant="secondary" size="sm">View Positions</GlowButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch Hiring Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Branch</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Hiring Status</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Total Positions</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Critically Needed</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Urgent</th>
                    <th className="text-center py-3 px-4 text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map(branch => {
                    const branchPositions = jobPositions.filter(p => p.branch === branch.id);
                    const criticalPositions = branchPositions.filter(p => p.status === 'Critically Needed').length;
                    const urgentPositions = branchPositions.filter(p => p.status === 'Urgent').length;
                    
                    return (
                      <tr key={branch.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="text-gray-900 font-semibold">{branch.name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-700">{branch.location}</p>
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={branch.hiringStatus} />
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-900">
                          {branchPositions.length}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-red-600">
                          {criticalPositions}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-orange-600">
                          {urgentPositions}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-1">
                            <GlowButton variant="secondary" icon={Briefcase} size="sm">Positions</GlowButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  isCount = false,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
  isCount?: boolean;
}) {
  const colorClasses = {
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 text-xl font-bold">
          {isCount ? value : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}