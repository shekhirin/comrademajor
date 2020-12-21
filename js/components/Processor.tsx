import React from "react"
import {Box, Button} from "@material-ui/core"
import Scanner from "../Scanner"
import {useDispatch, useSelector} from "react-redux"
import {
  addComment,
  addMessage,
  addPost,
  addProcessedComment,
  addProcessedMessage,
  addProcessedPost,
  countFile,
  reset,
  selectProcessedPaths,
  selectTotal
} from "../slice"
import Stats from "./Stats"

export default function ({scanner}: {scanner: Scanner}) {
  const dispatch = useDispatch()

  const processedPaths = useSelector(selectProcessedPaths)
  const total = useSelector(selectTotal)

  const click = async () => {
    const dir = await showDirectoryPicker()
    await dispatch(reset())

    await scanner.scanDirectory([dir.name], dir, "count")
    await scanner.scanDirectory([dir.name], dir, "process")
  }

  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={processedPaths.size != total}
        onClick={click}
      >
        Choose Directory
      </Button>
      <Stats/>
    </Box>
  )
}
