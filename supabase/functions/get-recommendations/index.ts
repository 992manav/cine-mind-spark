import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get user's quiz responses
    const { data: quizResponses } = await supabaseClient
      .from("quiz_responses")
      .select("*")
      .eq("user_id", user.id);

    // Get user's ratings
    const { data: ratings } = await supabaseClient
      .from("movie_ratings")
      .select("*, movies(*)")
      .eq("user_id", user.id)
      .order("rating", { ascending: false });

    // Get user's watch history
    const { data: watchHistory } = await supabaseClient
      .from("watch_history")
      .select("*, movies(*)")
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false });

    // Get user profile
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Build context for AI
    const preferences = quizResponses?.map(q => `${q.question_id}: ${q.answer}`).join("\n") || "No quiz data";
    const topRatedMovies = ratings?.slice(0, 5).map(r => `${r.movies.title} (${r.rating}/5)`).join(", ") || "No ratings";
    const recentWatched = watchHistory?.slice(0, 5).map(w => w.movies.title).join(", ") || "No watch history";
    const favoriteGenres = profile?.favorite_genres?.join(", ") || "Not specified";

    // Call Lovable AI for recommendations
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a movie recommendation AI. Based on user preferences, ratings, and watch history, recommend 5 movies from the database that match their taste. Return ONLY a JSON array of movie titles, nothing else. Format: ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"]`
          },
          {
            role: "user",
            content: `User Preferences:\n${preferences}\n\nTop Rated Movies: ${topRatedMovies}\n\nRecently Watched: ${recentWatched}\n\nFavorite Genres: ${favoriteGenres}\n\nRecommend 5 movies based on this data.`
          }
        ],
      }),
    });

    const aiData = await aiResponse.json();
    const recommendedTitles = JSON.parse(aiData.choices[0].message.content);

    // Get full movie details from database
    const { data: recommendedMovies } = await supabaseClient
      .from("movies")
      .select("*")
      .in("title", recommendedTitles);

    return new Response(
      JSON.stringify({
        recommendations: recommendedMovies,
        confidence: 0.85 + Math.random() * 0.15, // Simulated confidence score
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});