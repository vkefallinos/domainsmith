import { useQuery } from '@tanstack/react-query'
import { useGithub } from '@/lib/github/GithubContext'

export interface GithubWorkspace {
    id: number
    name: string // maps to workspaceName slug
    fullName: string
    description: string | null
    ownerAvatarUrl: string
    updatedAt: string
}

export function useWorkspaces() {
    const { octokit, isAuthenticated } = useGithub()

    return useQuery({
        // Only run the query if we are authenticated and have an octokit instance
        enabled: isAuthenticated && !!octokit,
        queryKey: ['github-workspaces'],
        queryFn: async (): Promise<GithubWorkspace[]> => {
            if (!octokit) throw new Error('Octokit not initialized')

            // Fetch repositories the authenticated user has access to
            const response = await octokit.rest.repos.listForAuthenticatedUser({
                sort: 'updated',
                per_page: 50,
            })

            return response.data.map(repo => ({
                id: repo.id,
                name: repo.name, // We use the repo name as the workspace slug
                fullName: repo.full_name,
                description: repo.description,
                ownerAvatarUrl: repo.owner.avatar_url,
                updatedAt: repo.updated_at || new Date().toISOString()
            }))
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })
}
