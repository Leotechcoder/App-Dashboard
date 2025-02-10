import UserForm from "../components/UserForm"
import UserList from "../components/UserList"
import { SearchBar } from "../components/SearchBar"
import Pagination from "../components/Pagination"
import { useDispatch } from "react-redux"
import { toggleOpenForm } from "../state/userSlice"

const Contact = () => {
  const dispatch = useDispatch()

  const handleOpenForm = () => {
    dispatch(toggleOpenForm())
  }

  return (
    <main className="p-6">
      <div className="mx-8">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
      </div>
      <div className="flex px-8 pb-4 flex-col md:flex-row justify-end gap-6 mb-6 border-b-2">
        <button onClick={handleOpenForm} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          + Nuevo Cliente
        </button>
        <SearchBar tipo={"clientes"} />
      </div>
      <UserForm />
      <div className="px-6 mb-3">
        <UserList />
      </div>
      <Pagination />
    </main>
  )
}

export default Contact

