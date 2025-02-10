import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { userApi } from "../../shared/infrastructure/api/userApi"
import { authApi } from "../../shared/infrastructure/api/authApi"
import { paginacionUsers } from "../../shared/infrastructure/utils/stateInitial"
import { idGenerator } from "../../shared/infrastructure/utils/idGenerator"

export const getUserData = createAsyncThunk("user/getUserData", userApi.getUsers)
export const createUserData = createAsyncThunk("user/createUserData", async (user) => {
  const userWithId = { ...user, id_: idGenerator("Users") }
  return await userApi.createUser(userWithId)
})
export const updateUserData = createAsyncThunk("user/updateUserData", userApi.updateUser)
export const deleteUserData = createAsyncThunk("user/deleteUserData", userApi.deleteUser)

export const registerUser = createAsyncThunk("user/registerUser", authApi.register)
export const loginUser = createAsyncThunk("user/loginUser", authApi.login)
export const getUserAuth = createAsyncThunk("user/getUserAuth", authApi.authUser)
export const loginUserGoogle = createAsyncThunk("user/loginUserGoogle", authApi.loginGoogle)
export const loginUserFacebook = createAsyncThunk("user/loginUserFacebook", authApi.loginFacebook)
export const logOutUser = createAsyncThunk("user/logOutUser", authApi.logout)

const initialState = {
  username: null,
  data: [],
  filteredUser: [],
  loading: true,
  error: false,
  get: false,
  isOpen: false,
  paginationUsers: paginacionUsers,
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
      .addCase(getUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(getUserData.rejected, (state) => {
        state.loading = false
        state.error = "Error al obtener los datos del usuario"
      })
      .addCase(createUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(createUserData.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createUserData.rejected, (state) => {
        state.loading = false
        state.error = "Error al crear el usuario"
      })
      .addCase(updateUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserData.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUserData.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false
        state.error = "Error al iniciar sesión"
      })
      .addCase(logOutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(logOutUser.rejected, (state) => {
        state.loading = false
        state.error = "Error al cerrar sesión"
      })
      .addCase(getUserAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserAuth.fulfilled, (state, action) => {
        state.loading = false
        state.username = action.payload.username
      })
      .addCase(getUserAuth.rejected, (state) => {
        state.loading = false
        state.error = "Error al obtener los datos del usuario"
      })
      .addCase(loginUserGoogle.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUserGoogle.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(loginUserGoogle.rejected, (state) => {
        state.loading = false
        state.error = "Error al iniciar sesión con Google"
      })
      .addCase(loginUserFacebook.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUserFacebook.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(loginUserFacebook.rejected, (state) => {
        state.loading = false
        state.error = "Error al iniciar sesión con Facebook"
      })
  },
})

export const { toggleGet, removeUser, toggleOpenForm, setFilteredUser, setCurrentPageUsers, setTotalItemsUsers } =
  userSlice.actions

export default userSlice.reducer

