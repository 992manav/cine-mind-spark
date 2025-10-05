import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";

export const AnalyticsCharts = () => {
  const [genreData, setGenreData] = useState<any[]>([]);
  const [ratingData, setRatingData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();

    // Subscribe to real-time rating updates
    const channel = supabase
      .channel("ratings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "movie_ratings",
        },
        () => {
          loadAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's ratings with movie details
      const { data: ratings } = await supabase
        .from("movie_ratings")
        .select("*, movies(*)")
        .eq("user_id", user.id);

      if (ratings) {
        // Calculate genre preferences
        const genreCounts: Record<string, { count: number; avgRating: number; totalRating: number }> = {};
        ratings.forEach((rating) => {
          const genre = rating.movies.genre;
          if (!genreCounts[genre]) {
            genreCounts[genre] = { count: 0, avgRating: 0, totalRating: 0 };
          }
          genreCounts[genre].count++;
          genreCounts[genre].totalRating += rating.rating;
        });

        const genreChartData = Object.entries(genreCounts).map(([genre, data]) => ({
          genre,
          preference: data.count,
          avgRating: (data.totalRating / data.count).toFixed(1),
        }));

        setGenreData(genreChartData);

        // Calculate rating distribution
        const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((rating) => {
          ratingCounts[rating.rating]++;
        });

        const ratingChartData = Object.entries(ratingCounts).map(([stars, count]) => ({
          stars: `${stars} ★`,
          count,
        }));

        setRatingData(ratingChartData);

        // Calculate engagement over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const engagementByDay: Record<string, number> = {};
        ratings
          .filter((r) => new Date(r.created_at) >= thirtyDaysAgo)
          .forEach((rating) => {
            const date = new Date(rating.created_at).toLocaleDateString();
            engagementByDay[date] = (engagementByDay[date] || 0) + 1;
          });

        const engagementChartData = Object.entries(engagementByDay)
          .map(([date, count]) => ({ date, ratings: count }))
          .slice(-14); // Last 14 days

        setEngagementData(engagementChartData);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-3xl font-bold">Your Movie Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Radar Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Genre Preferences</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={genreData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="genre" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar
                name="Movies Watched"
                dataKey="preference"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Rating Distribution Bar Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="stars" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Engagement Line Chart */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Rating Activity (Last 14 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ratings"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};