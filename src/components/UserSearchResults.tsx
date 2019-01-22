import React from 'react';
import { ReposNormalized } from '../utils/api';

type UserSearchResultsProps = {
    loading: boolean;
    repos: ReposNormalized[];
}

export const UserSearchResults = ({ loading, repos }: UserSearchResultsProps) => {
    return (
        <section className="py-4">
            {loading ? <p className="container">loading...</p> : repos.map((repo, i) => {
                return (
                    <div className="border-bottom  py-4" key={i}>
                        <div className="container">
                            <p className="mb-0">{repo.name}</p>
                            <ul className="mb-0">
                                {repo.contributors.map((contributor, j) =>
                                    <li key={j}>{`${contributor.login} (${contributor.contributions} commits)`}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}