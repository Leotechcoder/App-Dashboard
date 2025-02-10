"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

/**
 * @typedef {Object} TableDataParams
 * @property {Array} data - The data array to be paginated and filtered
 * @property {number} itemsPerPage - Number of items per page
 * @property {Array<string>} searchFields - Fields to search in
 * @property {function} setFilteredData - Function to set filtered data
 * @property {function} setCurrentPage - Function to set current page
 */

/**
 * Hook for handling table data with pagination and search
 * @param {TableDataParams} params
 */
export function useTableData({ data = [], itemsPerPage, searchFields, setFilteredData, setCurrentPage }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPageState] = useState(1);
  const [filteredData, setFilteredDataState] = useState([]);

  useEffect(() => {
    if (!data.length) return;

    const filtered = data.filter((item) =>
      searchFields.some((field) => item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (JSON.stringify(filtered) !== JSON.stringify(filteredData)) {
      setFilteredDataState(filtered);
      dispatch(setFilteredData(filtered));
    }

    setCurrentPageState(1);
  }, [searchTerm, data, dispatch, setFilteredData, searchFields]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPageState(page);
    dispatch(setCurrentPage(page));
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    paginatedData,
    totalPages,
    handlePageChange,
  };
}
