
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateDate } from "../../application/orderSlice"

const DateTime = () => {
  const fechaActualizada = useSelector((store) => store.orders.date)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateDate())
    const interval = setInterval(() => dispatch(updateDate()), 1000)
    return () => clearInterval(interval)
  }, [dispatch])

  // Función para formatear la fecha
  const formatDateTime = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${day}-${month}-${year} ${hours}:${minutes}`
  }

  return <span>{formatDateTime(fechaActualizada)}</span>
}

export default DateTime

