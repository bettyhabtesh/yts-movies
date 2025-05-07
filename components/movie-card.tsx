"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  medium_cover_image: string
  genres: string[]
  runtime?: number
}

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col bg-card/50 backdrop-blur-sm border-muted hover:border-primary/50 transition-all duration-300">
        <div className="relative h-[300px] w-full overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            src={movie.medium_cover_image || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
              <span>{movie.rating.toFixed(1)}</span> 
            </div>
          </div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col bg-gradient-to-b from-card/50 to-card">
          <h2 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h2>
          <div className="flex items-center justify-between mt-2 text-muted-foreground">
            <span>{movie.year}</span>
            {movie.runtime && (
              <div className="flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>{movie.runtime} min</span>
              </div>
            )}
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1 text-white">
              {movie.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 bg-primary/10 text-white text-xs rounded-full border border-primary/20"
                >
                {genre}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
