"use client"
import { useState, useEffect } from "react"
import MovieCard from "@/components/movie-card"
import { useMovies } from "@/hooks/use-movies"
import { Loader2, Search, Film } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const { movies, loading, error, totalMovies, totalPages } = useMovies({
    searchTerm: debouncedSearch,
    page: currentPage,
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // Reset to first page on new search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen">
      <div className="relative z-10 mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10 rounded-full opacity-30" />
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center mb-2">
            <Film className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              YTS Movies
            </h1>
          </div>
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search movies by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm border-muted focus-visible:ring-primary/50"
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center h-40">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
          <span className="text-muted-foreground">Loading movies...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center py-12">
          <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium">No movies found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or browse our collection</p>
          {debouncedSearch && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          <div className="text-center text-sm text-muted-foreground mt-2">
            Showing {movies.length} of {totalMovies} movies
          </div>
        </div>
      )}
    </main>
  )
}
