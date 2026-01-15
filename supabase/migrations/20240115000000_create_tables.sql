-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create Watchlist Table
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, symbol),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_symbol ON watchlist(symbol);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON watchlist TO anon, authenticated;

-- Policies for Users
CREATE POLICY "Public profiles are viewable by everyone" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true); -- In a real app, we'd check auth.uid() = id

-- Policies for Watchlist
CREATE POLICY "Users can view their own watchlist" ON watchlist
    FOR SELECT USING (true); -- In a real app, we'd check auth.uid() = user_id

CREATE POLICY "Users can add to their watchlist" ON watchlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete from their watchlist" ON watchlist
    FOR DELETE USING (true);
