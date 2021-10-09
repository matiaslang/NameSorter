import './App.css'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  Divider,
  Paper,
  IconButton,
  TableContainer,
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import SearchBar from 'material-ui-search-bar'
import CustomListItem from './List/CustomListItem'
import { useMutation, useQuery } from 'react-query'
import ky from 'ky'
import axios from 'axios'

const api = ky.create({
  prefixUrl: '/api',
  retry: 3,
  timeout: 60000,
})

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
})

async function fetchData() {
  var result = null
  try {
    result = await axios.get('https://nameapi.matiaslang.info/api/names')
    console.log(result.data)
  } catch (error) {
    console.error(error)
  }
  return result
}

function Names() {
  const { data, error, isError, isLoading } = useQuery('names', fetchData)
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error! {error.message}</div>
  }

  return <div className='container'>{data}</div>
}

const originalItems = [
  { name: 'Dill Pickles', amount: 20 },
  { name: 'Sweet Pickles', amount: 10 },
  { name: 'Bananas', amount: 30 },
  { name: 'Burger', amount: 43 },
  { name: 'Hot Dog', amount: 44 },
]

function App() {
  const [items, setItems] = useState(originalItems)
  const [names, setNames] = useState(originalItems)
  const [searched, setSearched] = useState('')
  const classes = useStyles()
  var firstLoad = true

  const mutation = useMutation((newJson) => {
    return axios.get(
      'https://nameapi.matiaslang.info/api/names',
      { headers: { 'Content-Type': 'application/json' } },
      newJson
    )
  })

  if (mutation.isSuccess && firstLoad === true) {
    if (names !== mutation.data.data) {
      setNames(mutation.data.data)
      firstLoad = false
    }
  }

  const requestSearch = (searchedVal) => {
    const filteredItems = names.filter((item) => {
      return item.name.toLowerCase().includes(searchedVal.toLowerCase())
    })
    console.log(filteredItems)
    setNames(filteredItems)
  }

  const cancelSearch = () => {
    setSearched('')
    requestSearch(searched)
  }

  return (
    <div className='App'>
      <Paper elevation={3}>
        <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
          placeholder='filter'
        />
        <TableContainer>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align='right'>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mutation.isLoading ? (
                'Fetching the list....'
              ) : (
                <>
                  {mutation.isError ? (
                    <div> An Error occurred: {mutation.error.message}</div>
                  ) : null}
                  {mutation.isSuccess
                    ? names.slice(0, 10).map((m) => <CustomListItem data={m} />)
                    : null}
                  <Divider variant='inset' component='li' />

                  <button
                    onClick={() => {
                      mutation.mutate({
                        id: new Date(),
                        title: 'Fetch names from DB',
                      })
                    }}
                  >
                    Fetch names from DB
                  </button>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}

export default App
