// useTableData.js (Refactorizado para aceptar filteredData desde ProductList)
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

export function useTableData({
  stateKey,
  itemsPerPage,
  searchFields,
  setFilteredData,
  setCurrentPage,
  externalFilteredData, // Ahora viene desde ProductList
}) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  const data = useSelector((state) => state[stateKey].data, shallowEqual);
  const reduxCurrentPage = useSelector((state) => state[stateKey].pagination?.currentPage || 1);

  const filteredData = useMemo(() => {
    if (!externalFilteredData) return data;
    if (!searchTerm) return externalFilteredData;
    return externalFilteredData.filter((item) =>
      searchFields.some((field) => item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [externalFilteredData, searchFields, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (localCurrentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, localCurrentPage, itemsPerPage]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData, itemsPerPage]);

  // Sincronizar página local con Redux
  useEffect(() => {
    setLocalCurrentPage(reduxCurrentPage);
  }, [reduxCurrentPage]);

  // Cuando cambia el searchTerm o los datos filtrados externos, resetear página a 1
  useEffect(() => {
    setLocalCurrentPage(1);
    dispatch(setCurrentPage(1));
  }, [searchTerm, externalFilteredData, dispatch, setCurrentPage]);

  // Manejar cambio de página
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
