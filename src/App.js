import './App.css'
import React, { useState, useEffect } from 'react'
import { Paper, Button, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import SearchBar from 'material-ui-search-bar'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import DataTable from './List/DataTable'
import GetToken from './GetToken'

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
})

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
  const [firstLoad, setFirstLoad] = useState(true)
  const classes = useStyles()

  require('dotenv').config()

  const mutation = useMutation((newJson) => {
    return axios.get(
      'https://nameapi.matiaslang.info/api/names',
      {
        headers: {
          'Content-Type': 'application/json',
          //todo: this is temporary, have to modify so that the token is fetched for every request. Currently the token is valid for a day
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlREMTl0VHZMT0Z4bmhXODVWNVp1ciJ9.eyJpc3MiOiJodHRwczovL2Rldi13dWhiMnoyci51cy5hdXRoMC5jb20vIiwic3ViIjoiWFB3WUJIUElOS1BLR3MyRzdrREQzZHFmd1JjZVdKdVRAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXV0aDAtand0LWF1dGhvcml6ZXIiLCJpYXQiOjE2MzQ3MjMwMzAsImV4cCI6MTYzNDgwOTQzMCwiYXpwIjoiWFB3WUJIUElOS1BLR3MyRzdrREQzZHFmd1JjZVdKdVQiLCJzY29wZSI6ImdldE5hbWVzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.LQQq8CTsPn-GlzAIE11u18siFKTG4kBW2g7fn2Va3fQRQ9rI8dm3EzXWutVjkGnLOcfOHmKnJZR39R0nO-fh2NC9H1ts2PkheYjOD2oOAytie2_9-WwC3xZM3hzo6adfuKzzr56ZpdRSVickbMxQ2YHpRjYQUYATQJ-BRmJo4gqQo42FTQETbsYmAt9zBFsS0nsBrgWmlBu667THLIcYTwQ3ZPMUen2AkTiWGdDvfwBguk70h1iMahfAPIygzk_e2q1OZQblnpX12YFOlvpXxNNck51VXE-6s-K2KR2H5bQ_jQUICCE1mWldNZrVWn8g3-OWqfp981ouEK1ENZCDJQ`,
        },
      },
      newJson
    )
  })
  console.log(process.env)
  useEffect(() => {
    if (mutation.isSuccess) {
      setNames(mutation.data.data)
      setOriginalNames(mutation.data.data)
      mutation.reset()
    }
  }, [mutation])

  const requestSearch = (searchedVal) => {
    const filteredItems = originalNames.filter((item) => {
      return item.name.toLowerCase().startsWith(searchedVal.toLowerCase())
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
      return (
        <div>
          <DataTable data={names} />
          There was an error with fetching new data: {mutation.error.message}
        </div>
      )
    }
    if (mutation.isSuccess) {
      return <DataTable data={names} />
    } else {
      return <DataTable data={names} />
    }
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
        <ToggleButtonGroup
          sx={{ margin: 2 }}
          color='primary'
          value={sorting}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value='amount'>Amount</ToggleButton>
          <ToggleButton value='alphabetically'>Alphabetically</ToggleButton>
        </ToggleButtonGroup>
        <DataLoaded mutation={mutation} />
        <Paper variant='outlined' sx={{ padding: 1 }}>
          <Button
            variant='contained'
            sx={{ margin: 2 }}
            onClick={(e) => {
              mutation.mutate({
                id: new Date(),
                title: 'Fetch names from DB',
              })
            }}
          >
            Fetch names from DB
          </Button>
        </Paper>
      </Paper>
    </div>
  )
}

export default App
