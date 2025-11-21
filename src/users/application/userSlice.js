// application/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Capas de la arquitectura limpia users
import { UserService } from "./userService.js"
import { UserRepositoryImpl } from "../infrastructure/userRepositoryImpl.js"
// Capas de la arquitectura limpia auth
import { AuthService } from "../application/authService.js"
import { AuthRepositoryImpl } from "../infrastructure/authRepositoryImpl.js"

import { paginacionUsers } from "../../shared/infrastructure/utils/stateInitial.js"

// 🔹 Inyectamos dependencias
const userRepo = new UserRepositoryImpl()
const userService = new UserService(userRepo)

const authRepo = new AuthRepositoryImpl()
const authService = new AuthService(authRepo)

// 🔹 Helper para aplanar instancias de User
const toPlainUser = (u) => ({ ...u })

// 🔹 Thunks de users (usan UserService)
export const getUserData = createAsyncThunk("user/getUserData", async () => {
  const {users, message} = await userService.getAllUsers()
  return ({users: users.map(toPlainUser), message})
})

export const createUserData = createAsyncThunk("user/createUserData", async (u) => {
  const {createdUser, message} = await userService.createUser(u)
  return ({createdUser: toPlainUser(createdUser), message})
})

export const updateUserData = createAsyncThunk("user/updateUserData", async (u) => {
  const {updatedUser, message} = await userService.updateUser(u)
  return ({updatedUser: toPlainUser(updatedUser), message})
})

export const deleteUserData = createAsyncThunk("user/deleteUserData", async (id) => {
  return await userService.deleteUser(id)
})

// 🔹 Thunks de auth (usan AuthService)
export const registerUser = createAsyncThunk("user/registerUser", async (u) => {
  return await authService.register(u)
})

export const loginUser = createAsyncThunk("user/loginUser", async ({ email, password }) => {
  return await authService.login({ email, password })
})

export const getUserAuth = createAsyncThunk("user/getUserAuth", async () => {
  return await authService.authUser()
})

export const loginUserGoogle = createAsyncThunk("user/loginUserGoogle", async () => {
  return await authService.loginGoogle()
})

export const loginUserFacebook = createAsyncThunk("user/loginUserFacebook", async () => {
  return await authService.loginFacebook()
})

export const logOutUser = createAsyncThunk("user/logOutUser", async () => {
  return await authService.logout()
})

// 🔹 Estado inicial
const initialState = {
  username: null,
  user: null,
  data: [],
  filteredUser: [],
  loading: null,
  error: null,
  get: false,
  isOpen: false,
  paginationUsers: paginacionUsers,
  message: null,
  showHelp: false,
  editingUser: null,
  formView: "list",
  sessionClosed: false,
}

// 🔹 Slice
const userSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {
    toggleGet: (state) => {
      state.get = !state.get
    },
    removeUser: (state, action) => {
      state.data = state.data.filter((u) => u.id !== action.payload)
    },
    removeMessage: (state) => {
      state.message = null
      state.error = null
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
    setShowHelpUsers: (state) =>{
      state.showHelp = !state.showHelp;
    },
     setEditingUser: (state, action) => {
      state.editingUser = action.payload
    },
    setFormView: (state, action) => {
      state.formView = action.payload
    },
    setClosedSession: (state, action) => {
      state.sessionClosed = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET USERS
      .addCase(getUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.users // Y ya guardo objeto plano
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error al obtener usuarios"
      })

      // CREATE
      .addCase(createUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(createUserData.fulfilled, (state, action) => {
        state.loading = false
        state.data.push(action.payload.createdUser) // Y ya guardo objeto plano
        state.message = action.payload.message 
      })
      .addCase(createUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error al crear el usuario"
      })

      // UPDATE
      .addCase(updateUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false
        const index = state.data.findIndex((u) => u.id === action.payload.updatedUser.id)
        if (index !== -1) {
          state.data[index] = action.payload.updatedUser // Y ya guardo objeto plano
        }
        state.message = action.payload.message
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error al actualizar usuario"
      })

      // DELETE
      .addCase(deleteUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUserData.fulfilled, (state, action) => {
        state.loading = false
        state.data = state.data.filter((user) => user.id !== action.payload.deletedId)
        state.message = action.payload.message
      })
      .addCase(deleteUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error al eliminar usuario"
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
        state.error = action.error.message || "Error al registrar usuario"
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.message = null
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.username = action.payload.user.username
        state.message = "Sesión iniciada exitosamente!"
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        if (action.error.message === "Invalid email or password") {
          state.error = "Email o contraseña invalidos!"
        } else {
          state.error = "Error al iniciar sesión"
        }
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
        state.error = action.error.message || "Error al cerrar sesión"
      })

      // GET AUTH USER
      .addCase(getUserAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserAuth.fulfilled, (state, action) => {
        state.loading = false
        state.username = action.payload.username
        state.user = action.payload.username
      })
      .addCase(getUserAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error al cargar el usuario"
      })

      // LOGIN GOOGLE
      .addCase(loginUserGoogle.pending, (state) => {
        state.loading = true
        state.message = null
      })
      .addCase(loginUserGoogle.fulfilled, (state) => {
        state.loading = false
        state.message = "Sesión iniciada exitosamente!"
        state.sessionClosed = false;
      })
      .addCase(loginUserGoogle.rejected, (state) => {
        state.loading = false
        state.error = "Error al iniciar sesión con Google"
      })

      // LOGIN FACEBOOK
      .addCase(loginUserFacebook.pending, (state) => {
        state.loading = true
        state.message = null
      })
      .addCase(loginUserFacebook.fulfilled, (state) => {
        state.loading = false
        state.message = "Sesión iniciada exitosamente!"
        state.sessionClosed = false;
      })
      .addCase(loginUserFacebook.rejected, (state) => {
        state.loading = false
        state.error = "Error al iniciar sesión con Facebook"
      })
  },
})

export const {
  toggleGet,
  removeUser,
  removeMessage,
  toggleOpenForm,
  setFilteredUser,
  setCurrentPageUsers,
  setTotalItemsUsers,
  setShowHelpUsers,
  setEditingUser,
  setFormView,
  setClosedSession,
} = userSlice.actions

export default userSlice.reducer
