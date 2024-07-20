import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar-container">
      <Link to="/">
        <img
          className="navbar-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="nav-list">
        <Link className="link" to="/">
          <li className="nav-list-item">Home</li>
        </Link>
        <Link className="link" to="/jobs">
          <li className="nav-list-item">Jobs</li>
        </Link>
        <li>
          <button className="logout-btn" type="button" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
