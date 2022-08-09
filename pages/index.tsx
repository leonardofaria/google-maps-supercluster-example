import type { NextPage } from 'next'
import GoogleMap from '../components/Map';
import data from '../cities.json';

const Home: NextPage = () => {
  const { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } = process.env;
  const cities = data['cities'];

  return (
    <div style={{ height: '100vh' }}>
      <GoogleMap
        apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        cities={cities}
      />
    </div>
  )
}

export default Home
