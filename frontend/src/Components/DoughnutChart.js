import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'

const DoughnutChart = ({ dataFromParent }) => {
  const [labels, setLabels] = useState(['Blue', 'Green', 'Orange'])
  const [_data, setData] = useState([5, 6, 7])

  useEffect(() => {
    if (dataFromParent) {
      setLabels(dataFromParent.map((item) => item.paymentMethod))
      setData(dataFromParent.map((item) => item.count))
    }
  }, [dataFromParent])

  const data = {
    labels,
    datasets: [
      {
        label: '# of Votes',
        data: _data,
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }
  return (
    <>
      <div className='header'></div>
      <Doughnut data={data} />
    </>
  )
}

export default DoughnutChart
