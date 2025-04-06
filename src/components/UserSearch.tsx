import { useState } from "react";
import { CommitData, GitHubUser, Repository } from "../GitHub.Interface";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface UserSearchProps {
  setUser: React.Dispatch<React.SetStateAction<GitHubUser | null>>;
  setRepositories: React.Dispatch<React.SetStateAction<Repository[]>>;
  setCommitData: React.Dispatch<React.SetStateAction<CommitData[]>>;
}

const UsernameSearch = ({
  setUser,
  setRepositories,
  setCommitData,
}: UserSearchProps) => {
  const [inputUsername, setInputUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (username: string) => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`
      );
      if (!userResponse.ok) {
        throw new Error(`User not found: ${userResponse.statusText}`);
      }
      const userData = await userResponse.json();
      setUser(userData);

      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      );
      if (!reposResponse.ok) {
        throw new Error(
          `Failed to fetch repositories: ${reposResponse.statusText}`
        );
      }
      const reposData = await reposResponse.json();
      setRepositories(reposData);

      const eventsResponse = await fetch(
        `https://api.github.com/users/${username}/events?per_page=100`
      );
      if (!eventsResponse.ok) {
        throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
      }
      const eventsData = await eventsResponse.json();

      const pushEvents = eventsData.filter(
        (event: any) => event.type === "PushEvent"
      );

      const commitsByDate: Record<string, number> = {};
      const today = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        commitsByDate[dateStr] = 0;
      }

      pushEvents.forEach((event: any) => {
        const date = new Date(event.created_at).toISOString().split("T")[0];
        if (commitsByDate[date] !== undefined) {
          commitsByDate[date] += event.payload.size || 0;
        }
      });

      const commitDataArray = Object.entries(commitsByDate)
        .map(([date, commits]) => ({
          date,
          commits,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setCommitData(commitDataArray);
    } catch (err) {
      setError("An error occurred");
      setUser(null);
      setRepositories([]);
      setCommitData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserData(inputUsername);
  };

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Input
              placeholder="Enter GitHub username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="flex-1 text-base"
              aria-label="GitHub username"
            />
            <Button
              type="submit"
              className="bg-gray-900 text-white font-semibold px-6 py-2 hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Analyzing...</span>
              ) : (
                "Analyze"
              )}
            </Button>
          </form>

          {error && (
            <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsernameSearch;
