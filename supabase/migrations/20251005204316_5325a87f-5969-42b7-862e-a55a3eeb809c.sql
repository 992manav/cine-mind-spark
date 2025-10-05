-- Create movies table for reference data
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  year INTEGER NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  image TEXT,
  director TEXT,
  actors TEXT[],
  language TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  favorite_genres TEXT[],
  favorite_actors TEXT[],
  favorite_directors TEXT[],
  preferred_languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz responses table
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create movie ratings table
CREATE TABLE public.movie_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Create watch history table
CREATE TABLE public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for movies (public read)
CREATE POLICY "Movies are viewable by everyone"
  ON public.movies FOR SELECT
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for quiz responses
CREATE POLICY "Users can view their own quiz responses"
  ON public.quiz_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz responses"
  ON public.quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for movie ratings
CREATE POLICY "Users can view all ratings"
  ON public.movie_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON public.movie_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.movie_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON public.movie_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for watch history
CREATE POLICY "Users can view their own watch history"
  ON public.watch_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch history"
  ON public.watch_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movie_ratings_updated_at
  BEFORE UPDATE ON public.movie_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample movies data
INSERT INTO public.movies (title, genre, year, rating, image, director, actors, language, description) VALUES
  ('The Brutalist', 'Drama', 2024, 9.4, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', 'Brady Corbet', ARRAY['Adrien Brody', 'Felicity Jones'], 'English', 'A visionary architect struggles in post-war America'),
  ('Anora', 'Comedy', 2024, 8.9, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop', 'Sean Baker', ARRAY['Mikey Madison', 'Mark Eydelshteyn'], 'English', 'A young sex worker finds unexpected romance'),
  ('Challengers', 'Romance', 2024, 9.2, 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop', 'Luca Guadagnino', ARRAY['Zendaya', 'Josh O''Connor'], 'English', 'A tennis prodigy navigates complex relationships'),
  ('The Substance', 'Horror', 2024, 8.7, 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop', 'Coralie Fargeat', ARRAY['Demi Moore', 'Margaret Qualley'], 'English', 'A fading celebrity uses a mysterious substance'),
  ('Dune: Part Two', 'Sci-Fi', 2024, 9.5, 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop', 'Denis Villeneuve', ARRAY['Timothée Chalamet', 'Zendaya'], 'English', 'Paul Atreides seeks revenge against conspirators');

-- Enable realtime for ratings
ALTER PUBLICATION supabase_realtime ADD TABLE public.movie_ratings;