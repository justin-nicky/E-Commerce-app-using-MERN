import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

const LineChart = ({ dataFromParent }) => {
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

  return (
    <>
      <div className='header'>
        <div className='links'></div>
      </div>
      <Line data={data} options={options} />
    </>
  )
}

export default LineChart
