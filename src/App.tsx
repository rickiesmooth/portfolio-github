import React, { Component } from 'react';
import { normalizeRepos, ReposNormalized } from "./utils/api";

import './App.scss';

class App extends Component<{}, { repos: ReposNormalized[], loading: boolean }> {
  state = {
    repos: [] as ReposNormalized[],
    loading: false
  }

  private username = ""

  readonly handleSubmit = async (username: string) => {
    this.setState({ loading: true })
    const repos = await normalizeRepos(username)
    this.setState({ repos, loading: false })
  }

  readonly handleInput = (username: string) => {
    this.username = username
  }

  render() {
    return (
      <div className="App">
        <header className="App-header jumbotron">
          <div className="container">
            <h1 className="text-light">Github Portfolio</h1>
          </div>
        </header>
        <section className="py-4 bg-light">
          <div className="container">
            <form className="form-inline" style={{ maxWidth: 768 }} onSubmit={e => {
              this.handleSubmit(this.username)
              e.preventDefault()
            }}>
              <span className="col-xs-3 col-md-3 d-flex align-items-center">
                <i className="fa fa-user" style={{ fontSize: 32 }}></i>
                <span className="ml-3">Username</span>
              </span>
              <input className="col-xs-6 col-md-6 form-control" type=" text" placeholder="Username" onChange={e => {
                this.handleInput(e.currentTarget.value)
                e.preventDefault()
              }} />
              <div className="col-xs-3 col-md-3" >
                <button className="btn btn-primary w-100" type="submit">Retrieve</button>
              </div>
            </form>
          </div>
        </section>
        <section >
          {this.state.loading ? <p className="container my-4">loading...</p> : this.state.repos.map((repo, i) => {
            return (
              <div className="border-bottom my-4" key={i} >
                <div className="container">
                  <div className="col-md-12 ">
                    <p >{repo.name}</p>
                    <ul>
                      {repo.contributors.map((contributor, j) =>
                        <li key={j}>{`${contributor.login} (${contributor.contributions} commits)`}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    );
  }
}

export default App;
