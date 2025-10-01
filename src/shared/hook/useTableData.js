
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"

export function useTableData({ stateKey, itemsPerPage, searchFields, setFilteredData, setCurrentPage }) {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [localCurrentPage, setLocalCurrentPage] = useState(1)

  // Usamos shallowEqual para evitar renders innecesarios
  const data = useSelector((state) => state[stateKey].data, shallowEqual)
  const reduxCurrentPage = useSelector((state) => state[stateKey].pagination?.currentPage || 1)

  // Filtrar datos solo si cambia el término de búsqueda o la data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    return data.filter((item) =>
      searchFields.some((field) => item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [data, searchFields, searchTerm])

  // Paginación optimizada con useMemo
  const paginatedData = useMemo(() => {
    const startIndex = (localCurrentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, localCurrentPage, itemsPerPage])

  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData, itemsPerPage])

  // Sincronizar la página local con Redux
  useEffect(() => {
    setLocalCurrentPage(reduxCurrentPage)
  }, [reduxCurrentPage])

  // Solo actualiza Redux si los datos realmente cambian
  const prevFiltered = useRef([]);

  useEffect(() => {
    if (JSON.stringify(prevFiltered.current) !== JSON.stringify(filteredData)) {
      dispatch(setFilteredData(filteredData));
      prevFiltered.current = filteredData;
    }
  }, [dispatch, setFilteredData, filteredData]);

  // Manejo optimizado del cambio de página
  const handlePageChange = useCallback(
    (page) => {
      if (page !== localCurrentPage) {
        setLocalCurrentPage(page)
        dispatch(setCurrentPage(page))
      }
    },
    [dispatch, setCurrentPage, localCurrentPage]
  )

  // Manejo optimizado del cambio de búsqueda
  const handleSearchChange = useCallback(
    (newSearchTerm) => {
      if (newSearchTerm !== searchTerm) {
        setSearchTerm(newSearchTerm)
        setLocalCurrentPage(1)
        dispatch(setCurrentPage(1))
      }
    },
    [dispatch, setCurrentPage, searchTerm]
  )

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage: localCurrentPage,
    paginatedData,
    totalPages,
    handlePageChange,
  }
}
