import AreaList from '../components/AreaList'
import HeroSection from '../components/HeroSection'

const mockAreas = [
  'Downtown Office Park',
  'North Tech Campus',
  'Airport Business District',
  'South Corporate Hub',
]

const HomePage = () => {
  return (
    <main className="container">
      <HeroSection />
      <AreaList areas={mockAreas} />
    </main>
  )
}

export default HomePage
