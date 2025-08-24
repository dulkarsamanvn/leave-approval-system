import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../api/axiosInstance"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Spinner from "../components/Spinner"

function EmployeeDashboard() {
  const [openModal, setOpenModal] = useState(false)
  const [leaveType, setLeaveType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [leaves, setLeaves] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const LEAVES_PER_PAGE = 5

  const types = [
    { value: "annual", label: "Annual" },
    { value: "sick", label: "Sick" },
    { value: "casual", label: "Casual" },
  ]

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/accounts/logout/")
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('role')
      toast.success("logged out successfully")
      navigate("/login", { replace: true })
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
        page_size: LEAVES_PER_PAGE
      }
      const res = await axiosInstance.get("/leave/all-leaves/", { params })
      setLeaves(res.data.leaves)
      setCount(res.data.count)
    } catch (err) {
      console.error("error fetching leaves", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeave = async () => {
    try {
      const res = await axiosInstance.post("/leave/request-leave/", {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      })
      toast.success("leave submitted successfully")
      fetchLeaves()
      setLeaveType("")
      setStartDate("")
      setEndDate("")
      setReason("")
    } catch (err) {
      toast.error("error submitting leave")
      console.error(err)
    } finally {
      setOpenModal(false)
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
                onClick={() => setOpenModal(true)}
                className="bg-[rgb(151,176,103)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[rgb(131,156,83)] transition duration-200"
              >
                Apply Leave
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
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
          </div>

          {isLoading ? (
            <Spinner />
          ) : (<div>
            {leaves.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg">No leave requests found</div>
              <p className="text-gray-500 mt-2">Click "Apply Leave" to submit your first request</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.map((leave, index) => (
                    <tr key={index} className="hover:bg-gray-50">
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
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(leave.status)}`}
                        >
                          {leave.status}
                        </span>
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

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Apply for Leave</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLeave()
              }}
              className="p-6"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(151,176,103)] focus:border-transparent"
                  required
                >
                  <option value="">Select leave type</option>
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(151,176,103)] focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(151,176,103)] focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(151,176,103)] focus:border-transparent resize-none"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[rgb(151,176,103)] text-white rounded-lg font-semibold hover:bg-[rgb(131,156,83)] transition duration-200"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDashboard
