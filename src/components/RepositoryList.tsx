
import { Star, GitFork, Eye, Calendar } from "lucide-react"
import { Repository } from "../GitHub.Interface"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

interface RepositoryListProps {
  repositories: Repository[]
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  if (repositories.length === 0) {
    return <div className="text-center py-8 ">No repositories found</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {repositories.map((repo) => (
      <Card
        key={repo.id}
        className="h-full flex flex-col justify-between hover:shadow-lg"
      >
        <CardHeader className="">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-lg font-semibold leading-snug">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {repo.name}
                </a>
              </CardTitle>
  
              {repo.description && (
                <CardDescription className="text-sm mt-1 ">
                  {repo.description}
                </CardDescription>
              )}
            </div>
  
            {repo.fork && (
              <Badge variant="outline" className="text-xs mt-1">
                Fork
              </Badge>
            )}
          </div>
        </CardHeader>
  
        <CardContent className="">
          <div className="">
            {repo.language && (
              <Badge variant="secondary" className="text-xs">
                {repo.language}
              </Badge>
            )}
            {repo.topics?.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
  
        <CardFooter className="pt-0 text-sm ">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center" title="Stars">
              <Star className="h-4 w-4 mr-1" />
              {repo.stargazers_count}
            </div>
            <div className="flex items-center" title="Forks">
              <GitFork className="h-4 w-4 mr-1" />
              {repo.forks_count}
            </div>
            {repo.watchers_count > 0 && (
              <div className="flex items-center" title="Watchers">
                <Eye className="h-4 w-4 mr-1" />
                {repo.watchers_count}
              </div>
            )}
            <div className="flex items-center" title="Last updated">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(repo.updated_at).toLocaleDateString()}
            </div>
          </div>
        </CardFooter>
      </Card>
    ))}
  </div>
  
  )
}

