import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setCurrentPageOrders, setFilteredOrders } from '../../orders/application/orderSlice'; // Importa las actions

export function useTableData({
    stateKey,
    itemsPerPage,
    searchFields,
    externalFilteredData,
}) {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [localCurrentPage, setLocalCurrentPage] = useState(1);

    const data = useSelector((state) => state[stateKey]?.data || [], shallowEqual);
    const reduxCurrentPage = useSelector((state) => state[stateKey]?.paginationOrders?.currentPage || 1);

    const filteredData = useMemo(() => {
        if (!externalFilteredData) return data;
        if (!searchTerm) return externalFilteredData;
        return externalFilteredData.filter((item) =>
            searchFields.some((field) => {
                const fieldValue = item[field];

                if (typeof fieldValue === 'string') {
                    return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
                }

                if (typeof fieldValue === 'number') {
                    return fieldValue.toString().includes(searchTerm);
                }

                return false;
            })
        );
    }, [externalFilteredData, searchFields, searchTerm, data]);

    const paginatedData = useMemo(() => {
        const startIndex = (localCurrentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, localCurrentPage, itemsPerPage]);

    const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData, itemsPerPage]);

    useEffect(() => {
        setLocalCurrentPage(reduxCurrentPage);
    }, [reduxCurrentPage]);

    useEffect(() => {
        dispatch(setFilteredOrders(filteredData)); // Usa la action creator importada
    }, [dispatch, filteredData, setFilteredOrders]); // Añade setFilteredOrders a las dependencias

    const handlePageChange = useCallback(
        (page) => {
            if (page !== localCurrentPage) {
                setLocalCurrentPage(page);
                dispatch(setCurrentPageOrders(page)); // Usa la action creator importada
            }
        },
        [dispatch, setCurrentPageOrders, localCurrentPage] // Añade setCurrentPageOrders a las dependencias
    );

    const handleSearchChange = useCallback(
        (newSearchTerm) => {
            if (newSearchTerm !== searchTerm) {
                setSearchTerm(newSearchTerm);
                setLocalCurrentPage(1);
                dispatch(setCurrentPageOrders(1)); // Usa la action creator importada
            }
        },
        [dispatch, setCurrentPageOrders, searchTerm] // Añade setCurrentPageOrders a las dependencias
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
