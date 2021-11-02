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
    //[dataFromParent?.map((item) => item.paymentMethod)] ||,
    //['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: _data,
        //[dataFromParent?.map((item) => item.count)] ||
        //[0, 0, 0],
        //[12, 19, 3, 5, 2, 3],
        backgroundColor: [
          //'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          //'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          //'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          //'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          //'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          //'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }
  return (
    <>
      <div className='header'>
        {/* <div className='links'>
        <a
          className='btn btn-gh'
          href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Doughnut.js'
        >
          Github Source
        </a>
      </div> */}
      </div>
      <Doughnut data={data} />
    </>
  )
}

export default DoughnutChart
