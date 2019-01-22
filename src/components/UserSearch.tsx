import React, { Component } from 'react';
import { ReposNormalized, normalizeRepos } from "../utils/api";
import { UserSearchResults } from "./UserSearchResults"

export class UserSearch extends Component {
    state = {
        repos: [] as ReposNormalized[],
        loading: false,
        error: null
    }
    handleSubmit = async () => {
        this.setState({ loading: true, error: null });
        const { repos, error } = await normalizeRepos(this.username)
        this.setState({ repos, error, loading: false, })
    }

    username = ""

    render() {
        const { repos, error, loading } = this.state
        return (
            <React.Fragment>
                <section className="py-4 bg-light">
                    <div className="container">
                        <form className="form-inline" style={{ maxWidth: 768 }} onSubmit={e => {
                            this.handleSubmit()
                            e.preventDefault()
                        }}>
                            <span className="col-xs-3 col-md-3 d-flex align-items-center">
                                <i className="fa fa-user" style={{ fontSize: 32 }}></i>
                                <span className="ml-3">Username</span>
                            </span>
                            <input className="col-xs-6 col-md-6 form-control" type=" text" placeholder="Username" onChange={e => {
                                this.username = e.currentTarget.value
                                e.preventDefault()
                            }} />
                            <div className="col-xs-3 col-md-3" >
                                <button className="btn btn-primary w-100" type="submit">Retrieve</button>
                            </div>
                        </form>
                    </div>
                </section>
                {
                    error ? <p className="container">{`${error}`}</p> : <UserSearchResults repos={repos} loading={loading} />
                }

            </React.Fragment>
        )
    }

}