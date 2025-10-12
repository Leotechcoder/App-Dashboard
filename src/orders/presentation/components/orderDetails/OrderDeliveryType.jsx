// OrderDeliveryType.jsx
const OrderDeliveryType = ({ deliveryType, setDeliveryType }) => (
  <div className="bg-gray-50 border-b-transparent border-gray-200">
    <div className="p-2 font-semibold text-gray-800 bg-gray-300 rounded-t-lg">ENTREGA</div>
    <div className="p-3">
      <select
        className="border rounded p-2 w-full text-sm"
        value={deliveryType}
        onChange={(e) => setDeliveryType(e.target.value)}
      >
        <option value="local">Retira en Local</option>
        <option value="delivery">Delivery</option>
      </select>
    </div>
  </div>
);

export default OrderDeliveryType;
