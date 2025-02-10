"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateDate } from "../../application/orderSlice"

const Date = () => {
  const fechaActualizada = useSelector((store) => store.orders.date)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateDate())
    const interval = setInterval(() => dispatch(updateDate()), 1000)
    return () => clearInterval(interval)
  }, [dispatch])

  return <span>{fechaActualizada}</span>
}

export default Date

