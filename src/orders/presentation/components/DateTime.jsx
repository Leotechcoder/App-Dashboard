import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const DateTime = () => {
  const dateFromStore = useSelector((store) => store.orders.date)
  const [currentTime, setCurrentTime] = useState(dateFromStore)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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

  return <span>{formatDateTime(currentTime)}</span>
}

export default DateTime
