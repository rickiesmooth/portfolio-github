import React, { Component } from 'react';
import { normalizeRepos, ReposNormalized } from "./utils/api";

import './App.css';

class App extends Component<{}, { repos: ReposNormalized[] }> {
  state = {
    repos: [] as ReposNormalized[]
  }

  private username = ""

  handleSubmit = async (username: string) => {
    const repos = await normalizeRepos(username)
    this.setState({ repos })
  }

  handleInput = (username: string) => {
    this.username = username
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Github Portfolio</h1>
        </header>
        <div>
          <span>username</span>
          <form onSubmit={e => {
            this.handleSubmit(this.username)
            e.preventDefault()
          }}>
            <div>
              <label htmlFor="usernameInput">Username</label>
              <input type="text" id="usernameInput" placeholder="Username" onChange={e => {
                this.handleInput(e.currentTarget.value)
                e.preventDefault()
              }} />
            </div>
            <button type="submit" >Confirm identity</button>
          </form>
        </div>
        <div>
          {this.state.repos.map((repo, i) => {
            return (
              <div>
                <p key={i}>{repo.name}</p>
                <p key={i}>{repo.contributors.length}</p>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
