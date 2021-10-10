import './App.css'
import React, { useState } from 'react'
import { Paper, Button, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import SearchBar from 'material-ui-search-bar'
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
  { name: 'Mikko', amount: 20 },
  { name: 'Maija', amount: 10 },
  { name: 'Pekka', amount: 30 },
  { name: 'Teppo', amount: 43 },
  { name: 'Irmeli', amount: 44 },
]

function sortAlphabetically(property) {
  var sortOrder = 1

  if (property[0] === '-') {
    sortOrder = -1
    property = property.substr(1)
  }

  return function (a, b) {
    if (sortOrder === 1) {
      return b[property].localeCompare(a[property])
    } else {
      return a[property].localeCompare(b[property])
    }
  }
}

function App() {
  const [items, setItems] = useState(originalItems)
  const [sorting, setSorting] = React.useState('amount')
  const [names, setNames] = useState(originalItems)
  const [originalNames, setOriginalNames] = useState(originalItems)
  const [searched, setSearched] = useState('')
  const classes = useStyles()
  const [firstLoad, setFirstLoad] = useState(true)

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
      setOriginalNames(mutation.data.data)
      setFirstLoad(false)
    }
  }

  const requestSearch = (searchedVal) => {
    const filteredItems = originalNames.filter((item) => {
      return item.name.toLowerCase().includes(searchedVal.toLowerCase())
    })
    setNames(filteredItems)
  }

  const cancelSearch = () => {
    setSearched('')
    requestSearch(searched)
  }

  const handleChange = (event, newAlignment) => {
    if (sorting !== newAlignment) {
      setSorting(newAlignment)
      setNames(
        newAlignment === 'amount'
          ? names.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
          : names.sort(sortAlphabetically('-name'))
      )
    }
  }

  const DataLoaded = ({ mutation }) => {
    if (mutation.isLoading) {
      return (
        <div>
          <DataTable data={names} />
          Loading data....
        </div>
      )
    }
    if (mutation.isError) {
      return <div>There was an error: {mutation.error}</div>
    }
    if (mutation.isSuccess) {
      return <DataTable data={names} />
    }
    return <DataTable data={names} />
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
        <Paper variant='outlined' sx={{ padding: 1 }}>
          <Button
            variant='contained'
            sx={{ margin: 2 }}
            onClick={(e) => {
              e.preventDefault()
              mutation.mutate({
                id: new Date(),
                title: 'Fetch names from DB',
              })
            }}
          >
            Fetch names from DB
          </Button>
          <ToggleButtonGroup
            color='primary'
            value={sorting}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value='amount'>Amount</ToggleButton>
            <ToggleButton value='alphabetically'>Alphabetically</ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Paper>
    </div>
  )
}

export default App
