import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../api/axiosInstance"

function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([])
  const [userRole, setUserRole] = useState(null)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/accounts/logout/")
      toast.success("logged out successfully")
      navigate("/login")
    } catch (err) {
      console.error("error logging out", err)
      toast.error("error logging out")
    }
  }

  const fetchLeaves = async () => {
    try {
      const res = await axiosInstance.get("/leave/all-leaves/")
      setLeaves(res.data.leaves)
      setUserRole(res.data.role)
    } catch (err) {
      console.error("error fetching leaves", err)
    }
  }

  const updateStatus = async (leaveId, newStatus) => {
    try {
      await axiosInstance.patch(`/leave/${leaveId}/update-status/`, { status: newStatus })
      setLeaves(prevLeaves =>
        prevLeaves.map(leave =>
          leave.id === leaveId ? { ...leave, status: newStatus } : leave
        )
      );
      toast.success('status updated successfully')
    } catch (err) {
      console.error('error updating status', err)
      toast.error('error updating status')
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
  }, [])

  return (
    <div className="min-h-screen bg-[rgb(47,82,73)]">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
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

          {leaves.length === 0 ? (
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.map((leave, index) => (
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
                        {userRole === 'manager' ? (
                          <select
                            value={leave.status}
                            onChange={(e) => updateStatus(leave.id, e.target.value)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
