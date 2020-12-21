import React from "react"
import {Box, Link, List, ListItem, ListItemText} from "@material-ui/core"
import {selectEntities, selectSearchTerm, setSearchTerm} from "../slice"
import {useDispatch, useSelector} from "react-redux"
import Item from "../types/Item"
import Comment from "./Comment"
import CommentType from "../types/Comment"
import MessageType from "../types/Message"
import PostType from "../types/Post"
import Message from "./Message"
import Post from "./Post"
import Search from "./Search"

export default function () {
  const dispatch = useDispatch()

  const entities = useSelector(selectEntities)
  const searchTerm = useSelector(selectSearchTerm)

  const elementForItem = (item: Item) => {
    switch (item.kind) {
      case "comment":
        return <Comment comment={item as CommentType}/>
      case "message":
        return <Message message={item as MessageType}/>
      case "post":
        return <Post post={item as PostType}/>
    }
  }

  const listItems = entities
    .filter(item => searchTerm === "" || item.contains(searchTerm))
    .map(item => {
      return (
        <ListItem key={item.id}>
          <ListItemText primary={<Link href={item.url}>{item.kind}</Link>} secondary={elementForItem(item)}/>
        </ListItem>
      )
    })

  const onSearchTermChange = (term) => dispatch(setSearchTerm(term))

  return (
    <Box>
      <Search onChange={onSearchTermChange}/>
      <List>
        {listItems}
      </List>
    </Box>
  )
}