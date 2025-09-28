import { createAsyncThunk } from "@reduxjs/toolkit"
import { productApi } from "../../shared/infrastructure/api/productApi"
import { categorias, paginacionProducts } from "../../shared/infrastructure/utils/stateInitial"
import { formatPrice } from "../../shared/infrastructure/utils/formatPrice"
import { createBaseSlice } from "../../shared/infrastructure/slices/baseSlice"

export const getDataProducts = createAsyncThunk("products/getData", productApi.getProducts)
export const getDataById = createAsyncThunk("products/getDataById", productApi.getProductById)
export const createData = createAsyncThunk("products/createData", productApi.createProduct)
export const updateData = createAsyncThunk("products/updateData", productApi.updateProduct)
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
  message: null,
}

const productSlice = createBaseSlice(
  "products",
  initialState,
  {
    setFormView: (state) => {
      state.isFormView = !state.isFormView;
    },
    setEditingProduct: (state, action) => {
      state.isEditing = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    voidSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSelectedCategory: (state, action) => {
      state.filters.categoria = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.filters.busqueda = action.payload || "";
    },
    setFilteredProduct: (state, action) => {
      if (state.filteredProducts !== action.payload) {
        state.filteredProducts = action.payload;
      }
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  (builder) => {
    builder
      // 🔹 GET PRODUCTS
      .addCase(getDataProducts.pending, (state) => {
        state.isLoading = true;
        state.message = null;
      })
      .addCase(getDataProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(getDataProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // 🔹 GET BY ID
      .addCase(getDataById.pending, (state) => {
        state.isLoading = true;
        state.message = null;
      })
      .addCase(getDataById.fulfilled, (state) => {
        state.isLoading = false;
        state.message = "Producto encontrado ✅";
      })
      .addCase(getDataById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // 🔹 CREATE
      .addCase(createData.pending, (state) => {
        state.isLoading = true;
        state.message = null;
      })
      .addCase(createData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.push(action.payload.data);
        state.message = "Producto creado con éxito 🎉";
      })
      .addCase(createData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // 🔹 UPDATE
      .addCase(updateData.pending, (state) => {
        state.isLoading = true;
        state.message = null;
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.data; // ⚠️ antes estaba action.payload.product
        state.data = state.data.map((p) =>
          p.id_ === updated.id_ ? updated : p // usar id_ porque tu objeto usa id_
        );
        state.message = action.payload.message; // opcional: usar mensaje del backend
      })
      .addCase(updateData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // 🔹 DELETE
      .addCase(deleteData.pending, (state) => {
        state.isLoading = true;
        state.message = null;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.deletedId;
        state.data = state.data.filter((p) => p.id !== deletedId);
        state.message = "Producto eliminado correctamente 🗑️";
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
);

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
  clearMessage,
} = productSlice.actions;

export default productSlice.reducer;


