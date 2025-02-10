"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteUserData, getUserData } from "../state/userSlice"
import { Eye, Pencil, Trash } from "lucide-react"
import EditUserForm from "./EditUserForm"

const UserList = () => {
  const dispatch = useDispatch()
  const { data = [], filteredUser = [], paginationUsers } = useSelector((store) => store.users)
  const [editModal, setEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [visibleDetails, setVisibleDetails] = useState({})

  useEffect(() => {
    if (data.length === 0) {
      dispatch(getUserData())
    }
  }, [dispatch, data])

  const users = filteredUser.length > 0 ? filteredUser : data

  const paginatedUsers = users.slice(
    (paginationUsers.currentPage - 1) * paginationUsers.itemsPerPage,
    paginationUsers.currentPage * paginationUsers.itemsPerPage,
  )

  const handleVer = (userId) => {
    setVisibleDetails((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  const handleEditar = (user) => {
    setSelectedUser(user)
    setEditModal(true)
  }

  const handleEliminar = async (id) => {
    await dispatch(deleteUserData(String(id)))
    dispatch(getUserData())
  }

  return (
    <>
      {editModal && <EditUserForm user={selectedUser} setEditModal={setEditModal} />}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
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
              ))
            ) : (
              <tr>
                <td className="px-2 py-4 text-center text-gray-500" colSpan="6">
                  No hay usuarios para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UserList

