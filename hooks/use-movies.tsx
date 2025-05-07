"use client"

import { useState, useEffect } from "react"

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  medium_cover_image: string
  genres: string[]
  runtime?: number
}

interface MoviesResponse {
  status: string
  status_message: string
  data: {
    movie_count: number
    limit: number
    page_number: number
    movies: Movie[]
  }
}

interface UseMoviesOptions {
  searchTerm?: string
  page?: number
  limit?: number
}

export function useMovies(options: UseMoviesOptions = {}) {
  const { searchTerm = "", page = 1, limit = 20 } = options

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalMovies, setTotalMovies] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  async function fetchMovies() {
    try {
      setLoading(true)

      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append("limit", limit.toString())
      queryParams.append("page", page.toString())

      if (searchTerm) {
        queryParams.append("query_term", searchTerm)
      }

      const url = `https://yts.mx/api/v2/list_movies.json?${queryParams.toString()}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data: MoviesResponse = await response.json()

      if (data.status === "ok") {
        setMovies(data.data.movies || [])
        setTotalMovies(data.data.movie_count)

        // Calculate total pages
        const calculatedTotalPages = Math.ceil(data.data.movie_count / limit)
        setTotalPages(calculatedTotalPages || 1)

        setError(null)
      } else {
        throw new Error(data.status_message)
      }
    } catch (err) {
      console.error("Error fetching movies:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch movies")
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchMovies()

    // Set up interval to fetch every 10 seconds
    const intervalId = setInterval(() => {
      console.log("Refreshing movie data...")
      fetchMovies()
    }, 10000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [searchTerm, page, limit])

  return {
    movies,
    loading,
    error,
    totalMovies,
    totalPages,
  }
}
