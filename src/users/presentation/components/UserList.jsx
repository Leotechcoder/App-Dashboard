"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteUserData, getUserData, setFilteredUser, setCurrentPageUsers } from "../state/userSlice"
import { Eye, Pencil, Trash } from "lucide-react"
import EditUserForm from "./EditUserForm"
import Pagination from "../../../shared/presentation/components/Pagination.jsx"
import SearchBar from "../../../shared/presentation/components/SearchBar.jsx"
import { useTableData } from "../../../shared/hooks/useTableData.js"

const UserList = () => {
  const dispatch = useDispatch()
  const { data, paginationUsers } = useSelector((store) => store.users)
  const [editModal, setEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [visibleDetails, setVisibleDetails] = useState({})

  const { searchTerm, setSearchTerm, currentPage, paginatedData, totalPages, handlePageChange } = useTableData({
    data,
    itemsPerPage: paginationUsers.itemsPerPage,
    searchFields: ["id", "username"],
    setFilteredData: setFilteredUser,
    setCurrentPage: setCurrentPageUsers,
  })

  useEffect(() => {
    if (data.length === 0) {
      dispatch(getUserData())
    }
  }, [dispatch, data])

  const handleVer = (userId) => {
    setVisibleDetails((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  const handleEditar = (user) => {
    setSelectedUser(user)
    setEditModal(true)
  }

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      await dispatch(deleteUserData(String(id)))
      dispatch(getUserData())
    }
  }

  return (
    <>
      {editModal && <EditUserForm user={selectedUser} setEditModal={setEditModal} />}
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar usuarios..." />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID", "Usuario", "Email", "Teléfono", "Dirección", "Acciones"].map((header) => (
                <th key={header} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 text-sm text-gray-500">{visibleDetails[user.id] ? user.id : "••••"}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.username}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{visibleDetails[user.id] ? user.email : "••••"}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.phone}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.address}</td>
                <td className="px-2 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleVer(user.id)} className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                    <button onClick={() => handleEditar(user)} className="p-1 hover:bg-gray-100 rounded">
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </button>
                    <button onClick={() => handleEliminar(user.id)} className="p-1 hover:bg-gray-100 rounded">
                      <Trash className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  )
}

export default UserList

