import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { Octokit } from '@octokit/rest'
import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device'
import { request } from '@octokit/request'

// Get Client ID from environment variables
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID

interface GithubUser {
    login: string
    avatar_url: string
    name: string | null
}

interface GithubContextType {
    octokit: Octokit | null
    user: GithubUser | null
    isAuthenticated: boolean
    isLoadingAuth: boolean
    login: () => Promise<void>
    logout: () => void
    deviceCodePrompt: { userCode: string; verificationUri: string } | null
}

const GithubContext = createContext<GithubContextType | undefined>(undefined)

export function GithubProvider({ children }: { children: ReactNode }) {
    const [octokit, setOctokit] = useState<Octokit | null>(null)
    const [user, setUser] = useState<GithubUser | null>(null)
    const [isLoadingAuth, setIsLoadingAuth] = useState(true)
    const [deviceCodePrompt, setDeviceCodePrompt] = useState<{ userCode: string; verificationUri: string } | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('github_token')
        if (token) {
            initializeOctokit(token)
        } else {
            setIsLoadingAuth(false)
        }
    }, [])

    const initializeOctokit = async (token: string) => {
        try {
            setIsLoadingAuth(true)
            const client = new Octokit({ auth: token })
            const { data } = await client.rest.users.getAuthenticated()
            setOctokit(client)
            setUser({
                login: data.login,
                avatar_url: data.avatar_url,
                name: data.name
            })
            localStorage.setItem('github_token', token)
        } catch (error) {
            console.error('Failed to initialize Octokit', error)
            localStorage.removeItem('github_token')
            setOctokit(null)
            setUser(null)
        } finally {
            setIsLoadingAuth(false)
        }
    }

    const login = async () => {
        try {
            if (!GITHUB_CLIENT_ID || GITHUB_CLIENT_ID === 'YOUR_GITHUB_CLIENT_ID') {
                const msg = 'Please set VITE_GITHUB_CLIENT_ID in your .env.local file with a valid GitHub OAuth App Client ID.'
                window.alert(msg)
                throw new Error(msg)
            }

            const customRequest = request.defaults({
                request: {
                    fetch: (url: any, options: any) => {
                        const urlStr = url.toString()
                        if (urlStr.startsWith('https://github.com')) {
                            return fetch(urlStr.replace('https://github.com', '/github-proxy'), options)
                        }
                        return fetch(url, options)
                    }
                }
            })

            const auth = createOAuthDeviceAuth({
                clientType: 'oauth-app',
                clientId: GITHUB_CLIENT_ID,
                scopes: ['repo', 'read:user'],
                onVerification(verification) {
                    setDeviceCodePrompt({
                        userCode: verification.user_code,
                        verificationUri: verification.verification_uri
                    })
                },
                request: customRequest
            })

            const tokenAuthentication = await auth({ type: 'oauth' })
            setDeviceCodePrompt(null)
            await initializeOctokit(tokenAuthentication.token)
        } catch (error) {
            console.error('Login failed', error)
            setDeviceCodePrompt(null)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('github_token')
        setOctokit(null)
        setUser(null)
        setDeviceCodePrompt(null)
    }

    return (
        <GithubContext.Provider
            value={{
                octokit,
                user,
                isAuthenticated: !!user,
                isLoadingAuth,
                login,
                logout,
                deviceCodePrompt
            }}
        >
            {children}
        </GithubContext.Provider>
    )
}

export function useGithub() {
    const context = useContext(GithubContext)
    if (context === undefined) {
        throw new Error('useGithub must be used within a GithubProvider')
    }
    return context
}
