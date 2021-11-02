import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from '@david.kucsai/react-pdf-table'

// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#E4E4E4',
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// })

// Create Document Component
const SalesReport = ({ orders }) => {
  //   //fetch orders from the backend
  //   const fetchSalesReport = async (type) => {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${userInfo.token}`,
  //       },
  //     }
  //     const { data } = await axios.get(
  //       `/api/dashboard/salesreport/${type}`,
  //       config
  //     )
  //     setOrders(data)
  console.log(orders)
  //   }
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>
          ~ {new Date().toLocaleDateString()} ~
        </Text>
        <Text style={styles.title}>Sales Report</Text>

        <Table data={orders}>
          <TableHeader>
            <TableCell>ID</TableCell>
            <TableCell>DATE</TableCell>
            <TableCell>TOTAL</TableCell>
            <TableCell>PAID</TableCell>
            <TableCell>STATUS</TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell getContent={(r) => r._id} style={styles.id} />
            <DataTableCell getContent={(r) => r.createdAt.substring(0, 10)} />
            <DataTableCell getContent={(r) => r.totalPrice} />
            <DataTableCell getContent={(r) => (r.isPaid ? 'Yes' : 'No')} />
            <DataTableCell getContent={(r) => r.status} />
          </TableBody>
        </Table>
      </Page>
    </Document>
  )
}

export default SalesReport

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
  id: {
    padding: 0,
    fontSize: 9,
    textAlign: 'center',
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  footer: {
    padding: '100px',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
})
// Fullscreen
// Default view
// Go to Previous lecture220.
