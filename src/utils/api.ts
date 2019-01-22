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

const getAllGithubResults = async<T>(url: string, results = [] as T[]): Promise<{ data: T[], error?: Error }> =>
    fetch(url, {
        headers: {
            Authorization: `token ${token}`
        }
    }).then(res => res.json().then(json => ({
        headers: res.headers,
        json
    })).then(async ({ json, headers }) => {
        if (res.status > 300) {
            return { error: new Error(res.statusText), data: [] }
        }

        const retrievedResults = [...results, ...json]
        const link = headers.get('Link')
        const parsedLink = link && parse(link)

        if (!parsedLink || !parsedLink.next) {
            return { data: retrievedResults }
        }

        return getAllGithubResults(parsedLink.next.url, retrievedResults)
    }));

export const normalizeRepos = async (username: string) => {
    const { error, data } = await getAllGithubResults<ReposRaw>(`https://api.github.com/users/${username}/repos`)

    return {
        error,
        repos: await Promise.all(data.map(({ contributors_url, full_name }) =>
            getAllGithubResults<ContributorsRaw>(contributors_url)
                .then(allContributors => ({
                    name: full_name,
                    // I know I'm looping (n0 * 2) over the array twice but this is more readable
                    contributors: allContributors.data.map(({ contributions, login, html_url, avatar_url }) => ({
                        login,
                        contributions,
                        html_url,
                        avatar_url
                    })).sort((a, b) => b.contributions - a.contributions)
                }))))
    }
}    
