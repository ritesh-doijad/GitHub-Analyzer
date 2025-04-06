

import { useState } from "react"

import { UserAnalytics } from "../components/UserAnalytical"
import { CommitData, GitHubUser, Repository } from "../GitHub.Interface"
import UsernameSearch from "../components/UserSearch"

export function GitHubProfileAnalyzer() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [commitData, setCommitData] = useState<CommitData[]>([])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl my-10 font-bold">GitHub Profile Analyzer</h1>
      <div>
      <UsernameSearch
        setUser={setUser}
        setRepositories={setRepositories}
        setCommitData={setCommitData}
      />

      {user && (
        <UserAnalytics
          user={user}
          repositories={repositories}
          commitData={commitData}
        />
      )}
      </div>
     
    </div>
  )
}
