import React from "react"
import {TextField} from "@material-ui/core"

export default function ({onChange}: {onChange: (term: string) => void}) {
  return (
    <TextField
      fullWidth
      label="Search"
      variant="outlined"
      onChange={(e) => onChange(e.target.value)}
    />
  )
}