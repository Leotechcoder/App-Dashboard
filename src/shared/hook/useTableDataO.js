import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

export function useTableData({ stateKey, itemsPerPage, searchFields, setFilteredData, setCurrentPage, initialData }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  const data = useSelector((state) => state[stateKey].data, shallowEqual);
  const reduxCurrentPage = useSelector((state) => state[stateKey].pagination?.currentPage || 1);

  const sortedData = useMemo(() => {
    const arr = initialData || data || [];
    return [...arr].sort(
      (a, b) => new Date(b.update_at || b.createdAt) - new Date(a.update_at || a.createdAt)
    );
  }, [data, initialData]);

const filteredData = useMemo(() => {
  const source = data || [];
  if (!searchTerm) return source;
  return source.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (typeof value === "string")
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      if (typeof value === "number")
        return value.toString().includes(searchTerm);
      return false;
    })
  );
}, [data, searchFields, searchTerm]);


  const paginatedData = useMemo(() => {
    const startIndex = (localCurrentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, localCurrentPage, itemsPerPage]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData, itemsPerPage]);

  useEffect(() => {
    setLocalCurrentPage(reduxCurrentPage);
  }, [reduxCurrentPage]);

  const prevFiltered = useRef([]);
  useEffect(() => {
    if (JSON.stringify(prevFiltered.current) !== JSON.stringify(filteredData)) {
      dispatch(setFilteredData(filteredData));
      prevFiltered.current = filteredData;
    }
  }, [dispatch, setFilteredData, filteredData]);

  const handlePageChange = useCallback(
    (page) => {
      if (page !== localCurrentPage) {
        setLocalCurrentPage(page);
        dispatch(setCurrentPage(page));
      }
    },
    [dispatch, setCurrentPage, localCurrentPage]
  );

  const handleSearchChange = useCallback(
    (newSearchTerm) => {
      if (newSearchTerm !== searchTerm) {
        setSearchTerm(newSearchTerm);
        setLocalCurrentPage(1);
        dispatch(setCurrentPage(1));
      }
    },
    [dispatch, setCurrentPage, searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: localCurrentPage,
    paginatedData,
    totalPages,
    handlePageChange,
  };
}
