import React, {useState} from "react"
import {FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Select} from "@material-ui/core"
import {useSelector} from "react-redux"
import {selectEntities, selectTotal} from "../slice"
import Item from "../types/items/Item"
import {highlightKindToString} from "@pkg"
import * as _ from "lodash"

enum GroupByType {
  ITEM,
  HIGHLIGHT
}

export default function () {
  const entities = useSelector(selectEntities)
  const total = useSelector(selectTotal)

  const [groupByType, setGroupByType] = useState(GroupByType.ITEM)

  const disabled = total == 0

  const items = Object
    .values(entities)
    .reduce((acc, entity) => {
      switch (groupByType) {
        case GroupByType.ITEM:
          const key = _.capitalize(entity.kind)
          acc.set(key, (acc.get(key) || new Set()).add(entity))
          break
        case GroupByType.HIGHLIGHT:
          entity.allHighlightedParts().forEach(part => {
            const key = highlightKindToString(part.kind)
            acc.set(key, (acc.get(key) || new Set()).add(entity))
          })
          break
      }

      return acc
    }, new Map<string, Set<Item>>())

  return (
    <>
      <FormControl fullWidth={true} disabled={disabled}>
        <InputLabel id="group-by-select-label"/>
        <Select
          labelId="group-by-select-label"
          value={groupByType}
          onChange={(e) => setGroupByType(e.target.value as GroupByType)}
        >
          <MenuItem value={GroupByType.ITEM}>Items</MenuItem>
          <MenuItem value={GroupByType.HIGHLIGHT}>Highlights</MenuItem>
        </Select>
      </FormControl>
      <List>
        {Array.from(items).map(([key, entities]) =>
          <ListItem key={key} disabled={disabled}>
            <ListItemText primary={key} secondary={`${entities.size} items`}/>
          </ListItem>
        )}
      </List>
    </>
  )
}
