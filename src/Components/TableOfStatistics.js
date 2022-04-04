import React from 'react'

const stylesheet = {
  table: {
    margin: '20px 0px',
    width: '100px',
    borderCollapse: 'collapse'
  },
  row: {
    border: '1px solid'
  },
  data: {
    border: '1px solid',
    textAlign: 'center'
  }
}

const header = (text, idx) => <th key={idx} style={stylesheet.data}>{text}</th>

const values = (text, idx) => <td key={idx} style={stylesheet.data}>{text}</td>

const TableOfStatistics = (properties) => {
  const {
    data
  } = properties

  return (
    <table style={stylesheet.table}>
      <tbody>
        <tr style={stylesheet.row}>
          {Object.keys(data).map(header)}
        </tr>
        <tr style={stylesheet.row}>
          {Object.values(data).map(values)}
        </tr>
      </tbody>
    </table>
  )
}

export default TableOfStatistics
