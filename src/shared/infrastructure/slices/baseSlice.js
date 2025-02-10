import { createSlice } from "@reduxjs/toolkit"

export const createBaseSlice = (name, initialState, reducers, extraReducers) => {
  return createSlice({
    name,
    initialState: {
      data: [],
      filteredData: [],
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        total: 0,
      },
      ...initialState,
    },
    reducers: {
      setFilteredData: (state, action) => {
        state.filteredData = action.payload
      },
      setCurrentPage: (state, action) => {
        state.pagination.currentPage = action.payload
      },
      setTotalItems: (state, action) => {
        state.pagination.total = action.payload
      },
      ...reducers,
    },
    extraReducers,
  })
}

