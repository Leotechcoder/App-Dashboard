// OrderUserSelector.jsx
const OrderUserSelector = ({
  orderDetails,
  handleUserInput,
  handleSelectUser,
  filteredUsers,
  showSuggestions,
  selectedOrder,
}) => (
  <div className="relative">
    <label className="block text-gray-600">Cliente</label>
    {selectedOrder?.userName ? (
      <span className="font-medium">{selectedOrder.userName}</span>
    ) : (
      <>
        <input
          type="text"
          value={orderDetails.userName || ""}
          onChange={handleUserInput}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Nombre del cliente"
        />
        {showSuggestions && filteredUsers.length > 0 && (
          <ul className="border rounded mt-1 max-h-40 overflow-auto bg-white absolute z-10 w-full">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </>
    )}
  </div>
);

export default OrderUserSelector;
