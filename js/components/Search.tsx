import React from "react"
import {TextField} from "@material-ui/core"
import {useSelector} from "react-redux"
import {selectTotal} from "../slice"

export default function ({onChange}: { onChange: (term: string) => void }) {
  const total = useSelector(selectTotal)

  const disabled = total == 0

  return (
    <TextField
      fullWidth
      label="Search"
      variant="outlined"
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )
}