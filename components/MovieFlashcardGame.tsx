'use client'

import { useState, useEffect } from 'react'
import styles from './MovieFlashcardGame.module.css'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

interface Movie {
  id: number
  title: string
  poster_path: string
  budget: number
}

export default function MovieFlashcardGame() {
  const [score, setScore] = useState(0)
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([])
  const [result, setResult] = useState('')
  const [showNext, setShowNext] = useState(false)

  async function fetchRandomMovies() {
    async function getMovieWithBudget(): Promise<Movie> {
      let movieDetails: Movie
      do {
        const randomPage = Math.floor(Math.random() * 200) + 1
        const response = await fetch(`${BASE_URL}/movie/popular?page=${randomPage}`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        })
        const movies = await response.json()
        const randomMovie = movies.results[Math.floor(Math.random() * movies.results.length)]
        const detailsResponse = await fetch(`${BASE_URL}/movie/${randomMovie.id}`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        })
        movieDetails = await detailsResponse.json()
      } while (!movieDetails.budget || movieDetails.budget === 0)
      return movieDetails
    }

    const movie1 = await getMovieWithBudget()
    const movie2 = await getMovieWithBudget()

    return [movie1, movie2]
  }

  function handleChoice(choice: number) {
    const correct = currentMovies[0].budget > currentMovies[1].budget ? 0 : 1

    if (choice === correct) {
      setScore(prevScore => prevScore + 1)
      setResult('Correct!')
    } else {
      setScore(0)
      setResult('Wrong!')
    }

    setShowNext(true)
  }

  async function startGame() {
    const movies = await fetchRandomMovies()
    setCurrentMovies(movies)
    setResult('')
    setShowNext(false)
  }

  useEffect(() => {
    startGame()
  }, [])

  return (
    <div className={styles.container}>
      <h1>Flashcard Movie Game</h1>
      <p>Click on the movie with the higher budget!</p>
      <div className={styles.score}>Score: <span>{score}</span></div>
      <div className={styles.flashcards}>
        {currentMovies.map((movie, index) => (
          <div key={movie.id} className={styles.flashcard} onClick={() => handleChoice(index)}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h3>{showNext ? `$${movie.budget.toLocaleString()}` : movie.title}</h3>
          </div>
        ))}
      </div>
      <div className={styles.result}>{result}</div>
      {showNext && (
        <button 
          className={`${styles.nextButton} ${result === 'Wrong!' ? styles.restart : ''}`} 
          onClick={startGame}
        >
          {result === 'Wrong!' ? 'Restart' : 'Next'}
        </button>
      )}
    </div>
  )
}

