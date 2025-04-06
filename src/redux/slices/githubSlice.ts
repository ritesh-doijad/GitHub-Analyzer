import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { GitHubUser, Repository, CommitData } from "../../GitHub.Interface"

interface GitHubState {
  username: string
  user: GitHubUser | null
  repositories: Repository[]
  commitData: CommitData[]
  loading: boolean
  error: string | null
}

const initialState: GitHubState = {
  username: "",
  user: null,
  repositories: [],
  commitData: [],
  loading: false,
  error: null,
}

export const fetchGitHubData = createAsyncThunk(
  "github/fetchGitHubData",
  async (username: string, { rejectWithValue }) => {
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`)
      if (!userRes.ok) throw new Error("User not found")
      const user = await userRes.json()

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      )
      if (!repoRes.ok) throw new Error("Failed to fetch repos")
      const repositories = await repoRes.json()

      const eventsRes = await fetch(
        `https://api.github.com/users/${username}/events?per_page=100`
      )
      if (!eventsRes.ok) throw new Error("Failed to fetch events")
      const events = await eventsRes.json()

      const pushEvents = events.filter((e: any) => e.type === "PushEvent")
      const commitsByDate: Record<string, number> = {}
      const today = new Date()

      for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        commitsByDate[dateStr] = 0
      }

      pushEvents.forEach((event: any) => {
        const date = new Date(event.created_at).toISOString().split("T")[0]
        if (commitsByDate[date] !== undefined) {
          commitsByDate[date] += event.payload.size || 0
        }
      })

      const commitData = Object.entries(commitsByDate).map(([date, commits]) => ({
        date,
        commits,
      }))

      return { user, repositories, commitData, username }
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGitHubData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGitHubData.fulfilled, (state, action) => {
        state.loading = false
        state.username = action.payload.username
        state.user = action.payload.user
        state.repositories = action.payload.repositories
        state.commitData = action.payload.commitData
      })
      .addCase(fetchGitHubData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default githubSlice.reducer
