import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

const LineChart = ({ dataFromParent }) => {
  //const [dataSet, setDataSet] = useState([0, 0, 0, 0, 0, 0, 0])

  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        label: 'Daily Sales',
        data: dataFromParent || [0, 0, 0, 0, 0, 0, 0],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  //   useEffect(() => {
  //     if (dataFromParent) {
  //       setDataSet(dataFromParent)
  //       console.log('linechart', dataFromParent)
  //     }
  //   }, [])
  return (
    <>
      <div className='header'>
        <div className='links'>
          {/* <a
          className='btn btn-gh'
          href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Line.js'
        >
          Github Source
        </a> */}
        </div>
      </div>
      <Line data={data} options={options} />
    </>
  )
}

export default LineChart
