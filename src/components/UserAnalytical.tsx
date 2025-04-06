import React from "react"
import { CommitData, GitHubUser, Repository } from "../GitHub.Interface"
import { UserProfile } from "./UserProfile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { RepositoryList } from "./RepositoryList"
import { CommitChart } from "./CommiteChart"

interface Props {
  user: GitHubUser
  repositories: Repository[]
  commitData: CommitData[]
}

export const UserAnalytics: React.FC<Props> = ({ user, repositories, commitData }) => {
  return (
    
  <div className="space-y-8 max-w-3xl mt-8 mx-auto px-4 shadow-xl sm:px-6 lg:px-8">
  {/* profile card */}
  <UserProfile user={user} />

  {/* Tabs */}
  <Tabs defaultValue="repositories" className="">
    <TabsList className="grid grid-cols-2 w-full gap-5 bg-muted rounded-lg p-1">
      <TabsTrigger
        value="repositories"
        className="data-[state=active]:bg-gray-900 data-[state=active]:text-white border-black rounded-md text-md"
      >
        Repositories ({repositories.length})
      </TabsTrigger>
      <TabsTrigger
        value="commits"
       className="data-[state=active]:bg-gray-900 data-[state=active]:text-white border-black rounded-md text-md"
      >
        Commit Activity
      </TabsTrigger>
    </TabsList>

    {/* Repositories */}
    <TabsContent value="repositories" className="mt-6">
      {repositories.length > 0 ? (
        <RepositoryList repositories={repositories} />
      ) : (
        <p className="text-muted-foreground text-sm">No public repositories found.</p>
      )}
    </TabsContent>

    {/* Commit Chart */}
    <TabsContent value="commits" className="mt-6">
      {commitData.length > 0 ? (
        <CommitChart commitData={commitData} />
      ) : (
        <p className="text-muted-foreground text-sm">No recent commit activity found.</p>
      )}
    </TabsContent>
  </Tabs>
</div>

  )
}
