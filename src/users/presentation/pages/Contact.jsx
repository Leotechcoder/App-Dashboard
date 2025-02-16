import UserForm from "../components/UserForm.jsx"
import UserList from "../components/UserList.jsx"

const Contact = () => {

  return (
    <main className="p-6">
      <div className="mx-8">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
      </div>
      <UserForm />
      <div className="px-6 mb-3">
        <UserList />
      </div>
    </main>
  )
}

export default Contact

