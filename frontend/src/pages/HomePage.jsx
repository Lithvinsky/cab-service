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
  const [isUsingLiveAreas, setIsUsingLiveAreas] = useState(false)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas')
        if (response.data.length > 0) {
          setAreas(response.data.map((item) => item.name))
          setIsUsingLiveAreas(true)
        }
      } catch {
        setAreas(mockAreas)
        setIsUsingLiveAreas(false)
      }
    }
    fetchAreas()
  }, [])

  return (
    <main className="container">
      <HeroSection />
      <section className="home-highlights">
        <article className="panel highlight-card">
          <p className="stat-label">Coverage</p>
          <p className="stat-value">{areas.length}</p>
          <p className="home-highlight-text">Cab areas currently available</p>
        </article>
        <article className="panel highlight-card">
          <p className="stat-label">Source</p>
          <p className="home-highlight-text">
            {isUsingLiveAreas ? 'Live data from admin configuration' : 'Fallback demo areas'}
          </p>
        </article>
      </section>
      <AreaList areas={areas} />
    </main>
  )
}

export default HomePage
