import { createAsyncThunk } from "@reduxjs/toolkit"
import { categorias, paginacionProducts } from "../../shared/infrastructure/utils/stateInitial"
import { createBaseSlice } from "../../shared/infrastructure/slices/baseSlice"
//Capas de la arquitectura limpia products
import { ProductService } from "./ProductService"
import { ProductRepositoryImpl } from "../infrastructure/ProductRepositoryImpl"

// 🔹 Inyectamos dependencia
const productRepo = new ProductRepositoryImpl()
const productService = new ProductService(productRepo)

//Helper para aplanar instancia de products
const toPlainProducts = (p) => ({ ...p })

export const getDataProducts = createAsyncThunk("products/getData", async ()=>{
  const products = await productService.getAllProducts()
  return products.map(toPlainProducts)
})
export const getDataById = createAsyncThunk("products/getDataById", async (id)=>{
  const product = await productService.getProductById(id)
  return toPlainProducts(product)
})
export const createData = createAsyncThunk("products/createData", async (product)=>{
  const { createdProduct, message } = await productService.createProduct(product)
  return {data: toPlainProducts(createdProduct), message}
})
export const updateData = createAsyncThunk("products/updateData", async (product)=>{
  const {updateProduct, message} = await productService.updateProduct(product)
  return {data: toPlainProducts(updateProduct), message}
})
export const deleteData = createAsyncThunk("products/deleteData", async(id)=>{
  await productService.deleteProduct(id)
  return id
})

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
  isEditing: null,
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
        state.data = action.payload;
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
        const updatedProduct = action.payload.data; 
        state.data = state.data.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
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
        const deletedId = action.payload;
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


