import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { userApi } from "../../shared/infrastructure/api/userApi"
import { authApi } from "../../shared/infrastructure/api/authApi"
import { paginacionUsers } from "../../shared/infrastructure/utils/stateInitial"
import { idGenerator } from "../../shared/infrastructure/utils/idGenerator"

export const getUserData = createAsyncThunk("user/getUserData", userApi.getUsers)
export const createUserData = createAsyncThunk("user/createUserData", userApi.createUser)
export const updateUserData = createAsyncThunk("user/updateUserData", userApi.updateUser)
export const deleteUserData = createAsyncThunk("user/deleteUserData", userApi.deleteUser)

export const registerUser = createAsyncThunk("user/registerUser", authApi.register.bind(authApi))
export const loginUser = createAsyncThunk("user/loginUser", authApi.login.bind(authApi))
export const getUserAuth = createAsyncThunk("user/getUserAuth", authApi.authUser.bind(authApi))
export const loginUserGoogle = createAsyncThunk("user/loginUserGoogle", authApi.loginGoogle.bind(authApi))
export const loginUserFacebook = createAsyncThunk("user/loginUserFacebook", authApi.loginFacebook.bind(authApi))
export const logOutUser = createAsyncThunk("user/logOutUser", authApi.logout.bind(authApi))

const initialState = {
  username: null,
  user: null,
  data: [],
  filteredUser: [],
  loading: null,
  error: null,          // 👈 en vez de false
  get: false,
  isOpen: false,
  paginationUsers: paginacionUsers,
  message: null,
}

const userSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {
    toggleGet: (state) => {
      state.get = !state.get
    },
    removeUser: (state, action) => {
      state.data = state.data.filter((user) => user.id !== action.payload)
    },
    removeMessage: (state) => {
      state.message = null
      state.error = null       // 👈 limpiar ambos
    },
    toggleOpenForm: (state) => {
      state.isOpen = !state.isOpen
    },
    setFilteredUser: (state, action) => {
      state.filteredUser = action.payload
    },
    setCurrentPageUsers: (state, action) => {
      state.paginationUsers.currentPage = action.payload
    },
    setTotalItemsUsers: (state, action) => {
      state.paginationUsers.total = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // GET USERS
      .addCase(getUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.users
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al obtener usuarios"
      })

      // CREATE
      .addCase(createUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(createUserData.fulfilled, (state) => {
        state.loading = false
        state.message = "Usuario creado exitosamente ✅"
      })
      .addCase(createUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al crear el usuario"
      })

      // UPDATE
      .addCase(updateUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserData.fulfilled, (state) => {
        state.loading = false
        state.message = "Usuario actualizado ✅"   // 👈 añade mensaje
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al actualizar usuario"
      })

      // DELETE
      .addCase(deleteUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUserData.fulfilled, (state) => {
        state.loading = false
        state.message = "Eliminado exitosamente ✅"
      })
      .addCase(deleteUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error || "Error al eliminar usuario"
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.message = null
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.message = "Usuario registrado"
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al registrar usuario"
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.message = null
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.message = "Sesión iniciada exitosamente!"
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al iniciar sesión"
      })

      // LOGOUT
      .addCase(logOutUser.pending, (state) => {
        state.loading = true
        state.message = null
        state.error = null
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.loading = false
        state.username = null
        state.user = null
        state.message = "Sesión cerrada exitosamente!"
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cerrar sesión"
      })
      .addCase(getUserAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserAuth.fulfilled, (state, action) => {
        state.loading = false
        state.username = action.payload.username
        state.user = action.payload.username
      })
      .addCase(getUserAuth.rejected, (state) => {
        state.loading = false
        state.error = "Error al obtener los datos del usuario"
      })
    builder
      .addCase(loginUserGoogle.pending, (state) => {
        state.loading = true
        state.message = null
      })
      .addCase(loginUserGoogle.fulfilled, (state) => {
        state.loading = false
        state.message = "Sesion iniciada exitosamente!"
      })
      .addCase(loginUserGoogle.rejected, (state) => {
        state.loading = false
        state.error = "Error al iniciar sesión con Google"
      })
      .addCase(loginUserFacebook.pending, (state) => {
        state.loading = true
        state.message = null
      })
      .addCase(loginUserFacebook.fulfilled, (state) => {
        state.loading = false
        state.message = "Sesion iniciada exitosamente!"
      })
      .addCase(loginUserFacebook.rejected, (state) => {
        state.loading = false
        state.error = "Error al iniciar sesión con Facebook"
      })
  },
})

export const { toggleGet, removeUser, removeMessage, toggleOpenForm, setFilteredUser, setCurrentPageUsers, setTotalItemsUsers } =
  userSlice.actions

export default userSlice.reducer

