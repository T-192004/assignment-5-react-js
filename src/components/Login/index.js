import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', errorPresent: false}

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  successLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  failureLogin = errorMsg => {
    this.setState({errorMsg, errorPresent: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const repsonse = await fetch('https://apis.ccbp.in/login', options)
    const data = await repsonse.json()
    if (repsonse.ok === true) {
      this.successLogin(data.jwt_token)
    } else {
      this.failureLogin(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, errorPresent} = this.state
    return (
      <div className="login-main-container">
        <div className="login-card-container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="login-form" onSubmit={this.submitForm}>
            <div className="input-container">
              <label className="input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                className="input-box"
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={this.updateUsername}
              />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="input-box"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={this.updatePassword}
              />
            </div>
            <button className="submit-btn" type="submit">
              Login
            </button>
            {errorPresent && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
