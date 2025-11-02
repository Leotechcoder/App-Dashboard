import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

// 🔠 Función auxiliar para normalizar textos (quita acentos, mayúsculas, espacios)
const normalize = (str) =>
  str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() || "";

/**
 * Hook de tabla genérico con:
 * - búsqueda flexible sin acentos ni mayúsculas
 * - paginación sincronizada con Redux
 * - filtro externo opcional (ej: pestañas o estado)
 */
export function useTableData({
  stateKey,
  itemsPerPage,
  searchFields,
  setFilteredData,
  setCurrentPage,
  initialData,
  externalFilter,
}) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  const data = useSelector((state) => state[stateKey].data, shallowEqual);
  const reduxCurrentPage = useSelector(
    (state) => state[stateKey].pagination?.currentPage || 1
  );

  // 🔹 1. Ordenar por fecha
  const sortedData = useMemo(() => {
    const arr = initialData || (Array.isArray(data) ? data : []);
    return [...arr].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
  }, [data, initialData]);

  // 🔹 2. Aplicar búsqueda (sin acentos ni mayúsculas)
  const searchedData = useMemo(() => {
    if (!searchTerm) return sortedData;

    const normalizedSearch = normalize(searchTerm);

    return sortedData.filter((item) =>
      searchFields.some((field) =>
        normalize(item[field]).includes(normalizedSearch)
      )
    );
  }, [sortedData, searchFields, searchTerm]);

  // 🔹 3. Aplicar filtro externo
  const fullyFilteredData = useMemo(() => {
    if (!externalFilter) return searchedData;
    return searchedData.filter(externalFilter);
  }, [searchedData, externalFilter]);

  // 🔹 4. Calcular total de páginas reales
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(fullyFilteredData.length / itemsPerPage));
  }, [fullyFilteredData, itemsPerPage]);

  // 🔹 5. Calcular los datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (localCurrentPage - 1) * itemsPerPage;
    return fullyFilteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [fullyFilteredData, localCurrentPage, itemsPerPage]);

  // 🔹 6. Sincronizar página actual con Redux
  useEffect(() => {
    setLocalCurrentPage(reduxCurrentPage);
  }, [reduxCurrentPage]);

  // 🔹 7. Actualizar Redux solo si hay cambios reales
  const prevFiltered = useRef([]);
  useEffect(() => {
    const prevString = JSON.stringify(prevFiltered.current);
    const newString = JSON.stringify(fullyFilteredData);

    if (prevString !== newString) {
      prevFiltered.current = fullyFilteredData;
      dispatch(setFilteredData(fullyFilteredData));
    }
  }, [dispatch, fullyFilteredData, setFilteredData]);

  // 🔹 8. Cambiar de página
  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages && page !== localCurrentPage) {
        setLocalCurrentPage(page);
        dispatch(setCurrentPage(page));
      }
    },
    [dispatch, setCurrentPage, localCurrentPage, totalPages]
  );

  // 🔹 9. Cambiar término de búsqueda
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
    fullyFilteredData,
  };
}
