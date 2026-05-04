import { useEffect, useState } from 'react'
import AreaList from '../components/AreaList'
import HeroSection from '../components/HeroSection'
import api from '../utils/api'

const mockAreas = [
  'Downtown Office Park',
  'North Tech Campus',
  'Airport Business District',
  'South Corporate Hub',
]

const HomePage = () => {
  const [areas, setAreas] = useState(mockAreas)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas')
        if (response.data.length > 0) {
          setAreas(response.data.map((item) => item.name))
        }
      } catch {
        setAreas(mockAreas)
      }
    }
    fetchAreas()
  }, [])

  return (
    <main className="container">
      <HeroSection />
      <AreaList areas={areas} />
    </main>
  )
}

export default HomePage
