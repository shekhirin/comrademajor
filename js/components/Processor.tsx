import React from "react"
import {Box, Button, List, ListItem, ListItemText} from "@material-ui/core"
import Scanner from "../Scanner"
import {useDispatch, useSelector} from "react-redux"
import {reset, selectKinds, selectProcessedPaths, selectTotal} from "../slice"
import CircularProgressWithLabel from "./CircularProgressWithLabel"

export default function ({scanner}: { scanner: Scanner }) {
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
      <Files disabled={total == 0}/>
    </Box>
  )
}

function Files({disabled}: { disabled?: boolean }) {
  const entities = useSelector(selectKinds)

  return (
    <List>
      {Object.entries(entities).map(([key, entity]) =>
        <ListItem key={key} disabled={disabled}>
          <ListItemText primary={entity.name} secondary={`${entity.total} items`}/>
          <CircularProgressWithLabel value={entity.processedPaths.size / entity.total * 100 || 0}/>
        </ListItem>
      )}
    </List>
  )
}