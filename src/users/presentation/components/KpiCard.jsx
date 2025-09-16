import React from "react";

const KpiCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="flex items-center justify-between bg-white shadow rounded-xl p-4 w-full">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  );
};

export default KpiCard;
