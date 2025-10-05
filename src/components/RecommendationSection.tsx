import { MovieCard } from "./MovieCard";

interface RecommendationSectionProps {
  type: "collaborative" | "content" | "hybrid";
}

const recommendationsData = {
  collaborative: [
    {
      id: "brutalist-1",
      title: "The Brutalist",
      genre: "Drama",
      year: 2024,
      rating: 9.4,
      matchScore: 94,
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop"
    },
    {
      id: "anora-1",
      title: "Anora",
      genre: "Comedy",
      year: 2024,
      rating: 8.9,
      matchScore: 89,
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"
    },
    {
      id: "challengers-1",
      title: "Challengers",
      genre: "Romance",
      year: 2024,
      rating: 9.2,
      matchScore: 92,
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop"
    },
    {
      id: "substance-1",
      title: "The Substance",
      genre: "Horror",
      year: 2024,
      rating: 8.7,
      matchScore: 87,
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop"
    }
  ],
  content: [
    {
      id: "dune-1",
      title: "Dune: Part Two",
      genre: "Sci-Fi",
      year: 2024,
      rating: 9.5,
      matchScore: 96,
      image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop"
    },
    {
      id: "oppenheimer-1",
      title: "Oppenheimer",
      genre: "Drama",
      year: 2023,
      rating: 9.3,
      matchScore: 91,
      image: "https://images.unsplash.com/photo-1574267432644-f610a13652c9?w=400&h=600&fit=crop"
    },
    {
      id: "poor-1",
      title: "Poor Things",
      genre: "Fantasy",
      year: 2023,
      rating: 8.8,
      matchScore: 88,
      image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop"
    },
    {
      id: "zone-1",
      title: "The Zone of Interest",
      genre: "Drama",
      year: 2023,
      rating: 9.0,
      matchScore: 90,
      image: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&h=600&fit=crop"
    }
  ],
  hybrid: [
    {
      id: "killers-1",
      title: "Killers of the Flower Moon",
      genre: "Drama",
      year: 2023,
      rating: 9.1,
      matchScore: 95,
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop"
    },
    {
      id: "past-1",
      title: "Past Lives",
      genre: "Romance",
      year: 2023,
      rating: 8.9,
      matchScore: 93,
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"
    },
    {
      id: "anatomy-1",
      title: "Anatomy of a Fall",
      genre: "Thriller",
      year: 2023,
      rating: 9.0,
      matchScore: 92,
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop"
    },
    {
      id: "may-1",
      title: "May December",
      genre: "Drama",
      year: 2023,
      rating: 8.7,
      matchScore: 88,
      image: "https://images.unsplash.com/photo-1574267432644-f610a13652c9?w=400&h=600&fit=crop"
    }
  ]
};

const descriptions = {
  collaborative: "Based on users with similar taste preferences",
  content: "Matched to your content preferences and viewing history",
  hybrid: "Combined AI analysis using multiple recommendation strategies"
};

export const RecommendationSection = ({ type }: RecommendationSectionProps) => {
  const movies = recommendationsData[type];

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-muted-foreground">{descriptions[type]}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {movies.map((movie, index) => (
          <MovieCard key={index} {...movie} />
        ))}
      </div>
    </div>
  );
};
