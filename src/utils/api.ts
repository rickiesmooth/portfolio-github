var parse = require('parse-link-header');
const token = "646dc6c29cea57fd413ac7c391428dfc14f20e53";

export type ContributorsRaw = {
    contributions: number;
    login: string,
    html_url: string;
    avatar_url: string
}

export type ReposRaw = {
    name: string;
    contributors_url: string
}

export type ReposNormalized = {
    name: string;
    contributors: ContributorsRaw[]
}

const getPaginatedResults = async <T>(url: string, results = [] as T[]): Promise<T[]> =>
    fetch(url, {
        headers: {
            Authorization: `token ${token}`
        }
    }).then(res => res.json().then(json => ({
        headers: res.headers,
        json
    })).then(async ({ json, headers }) => {
        const retrivedResults = [...results, ...json]
        const link = headers.get('Link')
        const parsedPaginationLinks = parse(link)
        const next = parsedPaginationLinks && parsedPaginationLinks.next

        if (next) {
            return await getPaginatedResults(next.url, retrivedResults)
        } else {
            return retrivedResults
        }

    }));

export const normalizeRepos = async (username: string) => {
    const repos = await getPaginatedResults<ReposRaw>(`https://api.github.com/users/${username}/repos`)
    return Promise.all<ReposNormalized>(repos.map(async ({ contributors_url, name }: ReposRaw): Promise<ReposNormalized> => {
        const allContributors = await getPaginatedResults<ContributorsRaw>(contributors_url)
        return {
            name,
            // I know I'm looping (n0 * 2) over the array twice but this is more readable
            contributors: allContributors.map(({ contributions, login, html_url, avatar_url }: ContributorsRaw) => {
                return ({
                    login,
                    contributions,
                    html_url,
                    avatar_url
                })
            }).sort((a, b) => b.contributions - a.contributions)
        }
    }))
}    
