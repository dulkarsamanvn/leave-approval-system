import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../api/axiosInstance"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Spinner from "../components/Spinner"


function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [employeeSummary, setEmployeeSummary] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [employeeModal, setEmployeeModal] = useState(false)
  const [username, SetUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const navigate = useNavigate()

  const LEAVES_PER_PAGE = 5

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/accounts/logout/")
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("role")
      toast.success("logged out successfully")
      navigate("/login")
    } catch (err) {
      console.error("error logging out", err)
      toast.error("error logging out")
    }
  }

  const fetchLeaves = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: currentPage,
        page_size: LEAVES_PER_PAGE,
      }
      const res = await axiosInstance.get("/leave/all-leaves/", { params })
      setLeaves(res.data.leaves)
      setUserRole(res.data.role)
      setCount(res.data.count)
    } catch (err) {
      console.error("error fetching leaves", err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (leaveId, newStatus) => {
    try {
      await axiosInstance.patch(`/leave/${leaveId}/update-status/`, { status: newStatus })
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) => (leave.id === leaveId ? { ...leave, status: newStatus } : leave)),
      )
      toast.success("status updated successfully")
    } catch (err) {
      console.error("error updating status", err)
      toast.error("error updating status")
    }
  }

  const handleViewEmployeeSummary = async (employeeId, employeeName) => {
    try {
      const res = await axiosInstance.get(`/leave/${employeeId}/summary/`)
      setEmployeeSummary({ ...res.data, name: employeeName })
      setModalOpen(true)
    } catch (err) {
      console.error("error fetching summary", err)
    }
  }

  const handleAddEmployeeModal = async () => {
    setEmployeeModal(true)
  }

  const handleAddEmployee = async () => {
    try {
      await axiosInstance.post('/accounts/create-employee/', {
        username: username,
        email: email,
        password: password
      })
      toast.success('Employee Added successfully')
    } catch (err) {
      toast.error('error adding employee')
      console.error('error adding employee', err)
    } finally {
      setEmployeeModal(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [currentPage])

  const filteredLeaves = leaves.filter((leave) => {
    const nameMatch = leave.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return nameMatch
  })
  const total_pages = Math.ceil(count / LEAVES_PER_PAGE)

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>,
    )

    // Page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(total_pages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 rounded-lg transition-colors ${currentPage === i ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
        >
          {i}
        </button>,
      )
    }

    // Show ellipsis and last page if needed
    if (endPage < total_pages) {
      if (endPage < total_pages - 1) {
        buttons.push(
          <span key="ellipsis" className="px-3 py-2 text-slate-400">
            ...
          </span>,
        )
      }

      buttons.push(
        <button
          key={total_pages}
          onClick={() => setCurrentPage(total_pages)}
          className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          {total_pages}
        </button>,
      )
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage((prev) => Math.min(total_pages, prev + 1))}
        disabled={currentPage === total_pages}
        className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>,
    )

    return buttons
  }

  return (
    <div className="min-h-screen bg-[rgb(47,82,73)]">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddEmployeeModal}
                className="bg-[rgb(47,82,73)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[rgb(47,82,73)]-600 transition duration-200"
              >
                Add Employee
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(47,82,73)]"
            />
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <div>
              {filteredLeaves.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-lg">No leave requests found</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Leave Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLeaves.map((leave, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {leave.employee_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {leave.leave_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(leave.start_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(leave.end_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {userRole === "manager" ? (
                              <select
                                value={leave.status}
                                onChange={(e) =>
                                  setPendingAction({
                                    leaveId: leave.id,
                                    newStatus: e.target.value
                                  }) || setConfirmModal(true)
                                }
                                className="border rounded px-2 py-1"
                                disabled={leave.status === "approved" || leave.status === "rejected"}
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(leave.status)}`}
                              >
                                {leave.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {userRole === "manager" && (
                              <button
                                onClick={() => handleViewEmployeeSummary(leave.employee_id, leave.employee_name)}
                                className="bg-[rgb(47,82,73)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[rgb(37,72,63)] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
      {!isLoading && total_pages > 1 && leaves.length > 0 && (
        <div className="flex items-center justify-center mt-8 gap-1">{renderPaginationButtons()}</div>
      )}
      {modalOpen && employeeSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[rgb(47,82,73)]">{employeeSummary.name}</h2>
              <p className="text-gray-600 text-sm mt-1">Leave Summary</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[rgb(47,82,73)]/10 p-4 rounded-lg">
                <p className="text-lg font-semibold text-[rgb(47,82,73)]">
                  Total Leaves Taken: <span className="text-2xl">{employeeSummary.total}</span>
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 mb-3">Breakdown by Type:</h3>
                {employeeSummary.summary.map((item) => (
                  <div
                    key={item.leave_type}
                    className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-700 capitalize">
                      {item.leave_type.charAt(0).toUpperCase() + item.leave_type.slice(1)}
                    </span>
                    <span className="bg-[rgb(47,82,73)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {item.days_taken}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-[rgb(47,82,73)] text-white rounded-lg font-medium hover:bg-[rgb(37,72,63)] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {employeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[rgb(47,82,73)]">Add Employee</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the details to add a new employee</p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => SetUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(47,82,73)] focus:border-[rgb(47,82,73)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(47,82,73)] focus:border-[rgb(47,82,73)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(47,82,73)] focus:border-[rgb(47,82,73)]"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => setEmployeeModal(false)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-6 py-2 bg-[rgb(47,82,73)] text-white rounded-lg font-medium hover:bg-[rgb(37,72,63)] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmModal && pendingAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className={`font-bold ${pendingAction.newStatus === "approved" ? "text-green-600" : "text-red-600"}`}>
                {pendingAction.newStatus}
              </span>{" "}
              this leave request?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmModal(false)
                  setPendingAction(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateStatus(pendingAction.leaveId, pendingAction.newStatus)
                  setConfirmModal(false)
                  setPendingAction(null)
                }}
                className={`px-4 py-2 rounded-lg text-white shadow-md ${pendingAction.newStatus === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default EmployeeDashboard
