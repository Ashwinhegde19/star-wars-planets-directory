import React, { useState, useEffect } from 'react';
import './App.css';

function PlanetCard({ planet }) {
  const [residents, setResidents] = useState([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  useEffect(() => {
    const fetchResidents = async () => {
      setLoadingResidents(true);
      const residentRequests = planet.residents.map(residentUrl =>
        fetch(residentUrl).then(res => res.json())
      );
      try {
        const residentData = await Promise.all(residentRequests);
        setResidents(residentData);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
      setLoadingResidents(false);
    };
    fetchResidents();
  }, [planet.residents]);

  return (
    <div className="planet-card">
      <h2>{planet.name}</h2>
      <p>Climate: {planet.climate}</p>
      <p>Population: {planet.population}</p>
      <p>Terrain: {planet.terrain}</p>
      <h3>Residents:</h3>
      {loadingResidents ? (
        <p>Loading residents...</p>
      ) : (
        <ul>
          {residents.map(resident => (
            <li key={resident.name}>
              Name: {resident.name}, 
              Height: {resident.height}, 
              Mass: {resident.mass}, 
              Gender: {resident.gender}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [planets, setPlanets] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loadingPlanets, setLoadingPlanets] = useState(true);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  useEffect(() => {
    const fetchPlanets = async () => {
      setLoadingPlanets(true);
      try {
        const response = await fetch('https://swapi.dev/api/planets/?format=json');
        const data = await response.json();
        setPlanets(data.results);
        setNextPage(data.next);
      } catch (error) {
        console.error('Error fetching planets:', error);
      }
      setLoadingPlanets(false);
    };
    fetchPlanets();
  }, []);

  const loadNextPage = async () => {
    setLoadingNextPage(true);
    try {
      const response = await fetch(nextPage);
      const data = await response.json();
      setPlanets(prevPlanets => [...prevPlanets, ...data.results]);
      setNextPage(data.next);
    } catch (error) {
      console.error('Error fetching next page:', error);
    }
    setLoadingNextPage(false);
  };

  return (
    <div className="App">
      <h1 className="header">Star Wars Planets Directory</h1>
      {loadingPlanets ? (
        <p>Loading planets...</p>
      ) : (
        <>
          <div className="planet-container">
            {planets.map(planet => (
              <PlanetCard key={planet.name} planet={planet} />
            ))}
          </div>
          {nextPage && (
            <div className="load-more-button">
              <button onClick={loadNextPage} disabled={loadingNextPage}>
                {loadingNextPage ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
