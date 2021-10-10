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
  Button,
} from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import SearchBar from 'material-ui-search-bar'
import CustomListItem from './List/CustomListItem'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import DataTable from './List/DataTable'

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

  const DataLoaded = ({ mutation }) => {
    if (mutation.isLoading) {
      return <div>Loading data....</div>
    }
    if (mutation.isError) {
      return <div>There was an error: {mutation.error}</div>
    }
    if (mutation.isSuccess) {
      return <DataTable data={mutation.data.data} />
    }
    return null
  }

  return (
    <div className='App'>
      <Paper elevation={3}>
        <SearchBar
          style={{ padding: 10 }}
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
          placeholder='filter'
        />
        <DataLoaded mutation={mutation} />
        <Button
          variant='contained'
          onClick={() => {
            mutation.mutate({
              id: new Date(),
              title: 'Fetch names from DB',
            })
          }}
        >
          Fetch names from DB
        </Button>
      </Paper>
    </div>
  )
}

export default App
