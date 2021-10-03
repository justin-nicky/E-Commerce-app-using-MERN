import Header from './Components/Header'
import Footer from './Components/Footer'
import { Container } from 'react-bootstrap'
const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <h1>hello world</h1>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default App
