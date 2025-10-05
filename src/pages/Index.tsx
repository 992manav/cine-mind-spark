import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/MovieCard";
import { RecommendationSection } from "@/components/RecommendationSection";
import { Navigation } from "@/components/Navigation";
import { MovieQuiz } from "@/components/MovieQuiz";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { Sparkles, TrendingUp, Star, Search, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"collaborative" | "content" | "hybrid">("collaborative");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    loadMovies();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      loadUserRatings(user.id);
    }

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserRatings(session.user.id);
      }
    });
  };

  const loadMovies = async () => {
    const { data, error } = await supabase.from("movies").select("*");
    if (data) setMovies(data);
  };

  const loadUserRatings = async (userId: string) => {
    const { data } = await supabase
      .from("movie_ratings")
      .select("movie_id, rating")
      .eq("user_id", userId);

    if (data) {
      const ratings: Record<string, number> = {};
      data.forEach((r) => {
        ratings[r.movie_id] = r.rating;
      });
      setUserRatings(ratings);
    }
  };

  const scrollToRecommendations = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to get personalized recommendations.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    toast({
      title: "Success!",
      description: "Your preferences have been saved. Check out your personalized recommendations!",
    });
    scrollToRecommendations();
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="animate-float">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">Powered by Advanced AI</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block mb-2">Discover Movies</span>
            <span className="block text-gradient">Powered by AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Experience intelligent movie recommendations using collaborative filtering, content-based analysis, and hybrid AI algorithms
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                  onClick={scrollToRecommendations}
                >
                  Get Recommendations
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
                  onClick={() => setShowQuiz(true)}
                >
                  Take AI Quiz
                </Button>
              </>
            ) : (
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                onClick={() => navigate("/auth")}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In to Get Started
              </Button>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Movie Quiz Modal */}
      {showQuiz && user && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Movie Personality Quiz</h2>
              <Button variant="ghost" onClick={() => setShowQuiz(false)}>
                Close
              </Button>
            </div>
            <MovieQuiz onComplete={handleQuizComplete} />
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <AnalyticsCharts />
          </div>
        </section>
      )}

      {/* AI Recommendation Engine */}
      <section id="recommendations" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm">AI-Powered Analysis</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Smart Recommendations</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI analyzes your preferences using multiple algorithms to deliver perfectly curated movie suggestions
            </p>
          </div>

          {/* Recommendation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="glass-effect rounded-lg p-2 flex space-x-2">
              <Button
                variant={activeTab === "collaborative" ? "default" : "ghost"}
                onClick={() => setActiveTab("collaborative")}
                className={activeTab === "collaborative" ? "bg-primary text-primary-foreground" : ""}
              >
                Collaborative
              </Button>
              <Button
                variant={activeTab === "content" ? "default" : "ghost"}
                onClick={() => setActiveTab("content")}
                className={activeTab === "content" ? "bg-primary text-primary-foreground" : ""}
              >
                Content-Based
              </Button>
              <Button
                variant={activeTab === "hybrid" ? "default" : "ghost"}
                onClick={() => setActiveTab("hybrid")}
                className={activeTab === "hybrid" ? "bg-primary text-primary-foreground" : ""}
              >
                Hybrid AI
              </Button>
            </div>
          </div>

          <RecommendationSection type={activeTab} />
        </div>
      </section>

      {/* Interactive Movie Discovery Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm">Curated Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Next Favorite</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our curated collection with advanced filtering and intelligent sorting
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass-effect border-border/50"
              />
            </div>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                genre={movie.genre}
                year={movie.year}
                rating={movie.rating}
                image={movie.image}
                userRating={userRatings[movie.id]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-gradient mb-4">CineMind AI</div>
          <p className="text-muted-foreground mb-6">
            Intelligent movie recommendations powered by advanced AI algorithms
          </p>
          <div className="text-sm text-muted-foreground">
            © 2025 CineMind AI. Scalability & Reliability Analysis Platform
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
