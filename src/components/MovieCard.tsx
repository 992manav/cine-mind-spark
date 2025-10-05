import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  title: string;
  genre: string;
  year: number;
  rating: number;
  image: string;
  matchScore?: number;
}

export const MovieCard = ({ title, genre, year, rating, image, matchScore }: MovieCardProps) => {
  const stars = Math.round(rating / 2);

  return (
    <div className="group relative glass-effect rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-elevated">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Match Score Badge */}
        {matchScore && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold shadow-glow">
              {matchScore}%
            </div>
          </div>
        )}

        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{genre} • {year}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < stars ? "fill-accent text-accent" : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{genre} • {year}</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < stars ? "fill-accent text-accent" : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <h3 className="font-semibold mb-3 truncate">{title}</h3>
        <Button className="w-full bg-primary hover:bg-primary/90">
          Rate Movie
        </Button>
      </div>
    </div>
  );
};
