import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  image: string;
  matchScore?: number;
  userRating?: number;
}

export const MovieCard = ({ id, title, genre, year, rating, image, matchScore, userRating }: MovieCardProps) => {
  const [selectedRating, setSelectedRating] = useState<number>(userRating || 0);
  const [isRating, setIsRating] = useState(false);
  const { toast } = useToast();

  const handleRating = async (stars: number) => {
    setIsRating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to rate movies.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("movie_ratings")
        .upsert({
          user_id: user.id,
          movie_id: id,
          rating: stars,
        });

      if (error) throw error;

      setSelectedRating(stars);
      toast({
        title: "Rating Saved!",
        description: `You rated ${title} ${stars} stars.`,
      });
    } catch (error) {
      console.error("Error rating movie:", error);
      toast({
        title: "Error",
        description: "Failed to save rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRating(false);
    }
  };
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
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Your Rating:</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((stars) => (
              <button
                key={stars}
                onClick={() => handleRating(stars)}
                disabled={isRating}
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 ${
                    stars <= selectedRating
                      ? "text-accent fill-accent"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
