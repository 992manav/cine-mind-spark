import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/MovieCard";
import { RecommendationSection } from "@/components/RecommendationSection";
import { Navigation } from "@/components/Navigation";
import { Sparkles, TrendingUp, Star, Search } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"collaborative" | "content" | "hybrid">("collaborative");
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToRecommendations = () => {
    document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
  };

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
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg animate-glow"
              onClick={scrollToRecommendations}
            >
              Get Recommendations
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
              asChild
            >
              <Link to="/admin">Admin Panel</Link>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

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
            {/* Sample movies - will be populated dynamically */}
            <MovieCard
              title="The Brutalist"
              genre="Drama"
              year={2024}
              rating={9.4}
              image="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop"
            />
            <MovieCard
              title="Anora"
              genre="Comedy"
              year={2024}
              rating={8.9}
              image="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"
            />
            <MovieCard
              title="Challengers"
              genre="Romance"
              year={2024}
              rating={9.2}
              image="https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop"
            />
            <MovieCard
              title="The Substance"
              genre="Horror"
              year={2024}
              rating={8.7}
              image="https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop"
            />
            <MovieCard
              title="Dune: Part Two"
              genre="Sci-Fi"
              year={2024}
              rating={9.5}
              image="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop"
            />
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
