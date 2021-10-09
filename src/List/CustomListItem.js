import {
  ListItemText,
  ListItem,
  Divider,
  TableRow,
  TableCell,
} from '@mui/material'

const CustomListItem = ({ data }) => {
  return (
    <div>
      <TableRow key={data.name}>
        <TableCell component='th' scope='row'>
          {data.name}
        </TableCell>
        <TableCell align='right'>{data.amount}</TableCell>
      </TableRow>
    </div>
  )
}

export default CustomListItem
