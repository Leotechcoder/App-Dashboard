import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

export function useTableData({ stateKey, itemsPerPage, searchFields, setFilteredData, setCurrentPage, initialData }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  const data = useSelector((state) => state[stateKey].data, shallowEqual);
  const reduxCurrentPage = useSelector((state) => state[stateKey].pagination?.currentPage || 1);

  const sortedData = useMemo(() => {
    const arr = initialData || (Array.isArray(data) ? data : []);
    return [...arr].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
  }, [data, initialData]);

   const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    return sortedData.filter((item) =>
      searchFields.some((field) => item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedData, searchFields, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (localCurrentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, localCurrentPage, itemsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / itemsPerPage),
    [filteredData, itemsPerPage]
  );

  // Sincronizar página actual con Redux
  useEffect(() => {
    setLocalCurrentPage(reduxCurrentPage);
  }, [reduxCurrentPage]);

  // Evitar dispatch repetido si el contenido es igual
  const prevFiltered = useRef([]);
  useEffect(() => {
    const prevString = JSON.stringify(prevFiltered.current);
    const newString = JSON.stringify(filteredData);

    if (prevString !== newString) {
      prevFiltered.current = filteredData;
      dispatch(setFilteredData(filteredData));
    }
  }, [dispatch, filteredData, setFilteredData]);

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
