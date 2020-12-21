import React from "react"
import {List, ListItem, ListItemText} from "@material-ui/core"
import CircularProgressWithLabel from "./CircularProgressWithLabel"
import {useSelector} from "react-redux"
import {selectKinds} from "../slice"

export default function () {
  const entities = useSelector(selectKinds)

  return (
    <List>
      {Object.entries(entities).map(([key, entity]) =>
        <ListItem key={key}>
          <ListItemText primary={entity.name} secondary={`${entity.total} items`}/>
          <CircularProgressWithLabel value={entity.processedPaths.size / entity.total * 100 || 0}/>
        </ListItem>
      )}
    </List>
  )
}
