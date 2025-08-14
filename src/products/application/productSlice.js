import { createAsyncThunk } from "@reduxjs/toolkit"
import { productApi } from "../../shared/infrastructure/api/productApi"
import { categorias, paginacionProducts } from "../../shared/infrastructure/utils/stateInitial"
import { formatPrice } from "../../shared/infrastructure/utils/formatPrice"
import { createBaseSlice } from "../../shared/infrastructure/slices/baseSlice"

export const getDataProducts = createAsyncThunk("products/getData", productApi.getProducts)
export const getDataById = createAsyncThunk("products/getDataById", productApi.getProductById)
export const createData = createAsyncThunk("products/createData", async (product) => {
  const formattedProduct = { ...product, price: formatPrice(product.price) }
  return await productApi.createProduct(formattedProduct)
})
export const updateData = createAsyncThunk("products/updateData", async (product) => {
  const formattedProduct = { ...product, price: formatPrice(product.price) }
  return await productApi.updateProduct(formattedProduct)
})
export const deleteData = createAsyncThunk("products/deleteData", productApi.deleteProduct)

const initialState = {
  data: [],
  selectedProduct: null,
  filteredProducts: [],
  isLoading: false,
  error: null,
  categorias: categorias,
  filters: {
    categoria: null,
    busqueda: "",
  },
  pagination: paginacionProducts,
  isFormView: false,
  isEditing: false,
}

const productSlice = createBaseSlice(
  "products",
  initialState,
  {
    setFormView: (state) => {
      state.isFormView = !state.isFormView
    },
    setEditingProduct: (state, action) => {
      state.isEditing = action.payload
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    voidSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSelectedCategory: (state, action) => {
      state.filters.categoria = action.payload
    },
    setSearchTerm: (state, action) => {
      state.filters.busqueda = action.payload || ""
    },
    setFilteredProduct: (state, action) => {
      if (state.filteredProducts !== action.payload) {
        state.filteredProducts = action.payload;
      }
    }
  },
  (builder) => {
    builder
      .addCase(getDataProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDataProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(getDataProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(getDataById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDataById.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(getDataById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(createData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createData.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(updateData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateData.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(updateData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(deleteData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteData.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
)

export const {
  setFormView,
  setEditingProduct,
  setSelectedProduct,
  voidSelectedProduct,
  setSelectedCategory,
  setSearchTerm,
  setCurrentPage,
  setTotalItems,
  setFilteredProduct,
} = productSlice.actions

export default productSlice.reducer

