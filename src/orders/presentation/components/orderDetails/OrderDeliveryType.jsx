// OrderDeliveryType.jsx
const OrderDeliveryType = ({ deliveryType, setDeliveryType }) => (
  <div className="">
    <div className="py-1 font-semibold text-gray-800">ENTREGA</div>
    <div className="py-1">
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
