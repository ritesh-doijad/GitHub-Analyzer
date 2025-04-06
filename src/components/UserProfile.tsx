
import { CalendarDays, MapPin, LinkIcon, Twitter } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { GitHubUser } from "../GitHub.Interface"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface UserProfileProps {
  user: GitHubUser
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 rounded-md">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2 flex-1">
            <div>
              <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
              <p className="text-muted-foreground">@{user.login}</p>
            </div>

            {user.bio && <p>{user.bio}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.twitter_username && (
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600"
                  >
                    @{user.twitter_username}
                  </a>
                </div>
              )}

              {user.blog && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600 truncate max-w-[200px]"
                  >
                    {user.blog}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <div>
                <span className="font-bold">{user.followers}</span>{" "}
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div>
                <span className="font-bold">{user.following}</span>{" "}
                <span className="text-muted-foreground">Following</span>
              </div>
              <div>
                <span className="font-bold">{user.public_repos}</span>{" "}
                <span className="text-muted-foreground">Repositories</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

