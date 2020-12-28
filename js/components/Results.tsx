import React, {useState} from "react"
import {Box, Link, List, ListItem, ListItemText} from "@material-ui/core"
import {selectEntities} from "../slice"
import {useSelector} from "react-redux"
import Item from "../types/items/Item"
import Comment from "./items/Comment"
import CommentType from "../types/items/Comment"
import MessageType from "../types/items/Message"
import PostType from "../types/items/Post"
import Message from "./items/Message"
import Post from "./items/Post"
import Search from "./Search"

export default function () {
  const entities = useSelector(selectEntities)

  const [searchTerm, setSearchTerm] = useState("")

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

  const onSearchTermChange = (term) => setSearchTerm(term)

  return (
    <Box>
      <Search onChange={onSearchTermChange}/>
      <List>
        {listItems}
      </List>
    </Box>
  )
}