import React from "react"
import ReactDOM from "react-dom"
import {
  Box,
  Container,
  createMuiTheme,
  createStyles,
  CssBaseline,
  Grid,
  makeStyles,
  Paper,
  Theme,
  ThemeProvider
} from "@material-ui/core"
import Results from "./components/Results"
import {Provider, useDispatch} from "react-redux"
import {store} from "./store"
import Processor from "./components/Processor"
import Scanner from "./Scanner"
import {
  addComment,
  addMessage,
  addPost,
  addProcessedComment,
  addProcessedMessage,
  addProcessedPost,
  countFile
} from "./slice"
import Stats from "./components/Stats"

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2)
    }
  })
)

function App() {
  const dispatch = useDispatch()
  const classes = useStyles()

  const scanner = new Scanner(
    (kind) => dispatch(countFile(kind)),
    {
      comment: (path) => dispatch(addProcessedComment(path)),
      message: (path) => dispatch(addProcessedMessage(path)),
      post: (path) => dispatch(addProcessedPost(path))
    },
    {
      comment: (item) => dispatch(addComment(item)),
      message: (item) => dispatch(addMessage(item)),
      post: (item) => dispatch(addPost(item))
    })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>

      <Container maxWidth={"lg"}>
        <Box mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Processor scanner={scanner}/>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Stats/>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={9}>
              <Paper className={classes.paper}>
                <Results/>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
