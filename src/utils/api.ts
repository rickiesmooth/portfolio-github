var parse = require('parse-link-header');
const token = "646dc6c29cea57fd413ac7c391428dfc14f20e53";

export type ContributorsRaw = {
    contributions: number;
    login: string,
    html_url: string;
    avatar_url: string
}

export type ReposRaw = {
    full_name: string;
    contributors_url: string
}

export type ReposNormalized = {
    name: string;
    contributors: ContributorsRaw[]
}

const getAllGithubResults = async <T>(url: string, results = [] as T[]): Promise<T[]> =>
    fetch(url, {
        headers: {
            Authorization: `token ${token}`
        }
    }).then(res => res.json().then(json => ({
        headers: res.headers,
        json
    })).then(async ({ json, headers }) => {
        const retrievedResults = [...results, ...json]
        const link = headers.get('Link')
        const parsedPaginationLinks = link && parse(link)
        const next = parsedPaginationLinks && parsedPaginationLinks.next

        return next ? await getAllGithubResults(next.url, retrievedResults) : retrievedResults

    }));

export const normalizeRepos = async (username: string) => {
    const allRepos = await getAllGithubResults<ReposRaw>(`https://api.github.com/users/${username}/repos`)
    return Promise.all(allRepos.map(async ({ contributors_url, full_name }) => {
        const allContributors = await getAllGithubResults<ContributorsRaw>(contributors_url)
        return {
            name: full_name,
            // I know I'm looping (n0 * 2) over the array twice but this is more readable
            contributors: allContributors.map(({ contributions, login, html_url, avatar_url }) => {
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
