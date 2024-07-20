import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import NotFound from '../NotFound'
import './index.css'

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class Jobs extends Component {
  state = {
    searchInput: '',
    profileDetails: {},
    apiStatus: apiUrlStatusConstants.initial,
    activeEmployementId: '',
    activeSalarayRangeId: '',
    apiJobsStatus: apiUrlStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getProfileDetails()
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({apiJobsStatus: apiUrlStatusConstants.inProgress})
    const {searchInput, activeEmployementId, activeSalarayRangeId} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const activeEmployementsListString = activeEmployementId
    console.log(activeEmployementsListString)
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmployementsListString}&minimum_package=${activeSalarayRangeId}&search=${searchInput}`
    const response = await fetch(jobsApiUrl, options)
    const fetchedJobsData = await response.json()
    console.log(response)
    if (response.ok === true) {
      const updatedJobFetchedData = fetchedJobsData.jobs.map(eachJob =>
        this.getUpdateJobData(eachJob),
      )
      this.setState({
        jobsList: updatedJobFetchedData,
        apiJobsStatus: apiUrlStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiUrlStatusConstants.failure})
    }
  }

  getUpdateJobData = eachJob => ({
    companyLogoUrl: eachJob.company_logo_url,
    employmentType: eachJob.employment_type,
    id: eachJob.id,
    jobDescription: eachJob.job_description,
    location: eachJob.location,
    packagePerAnnum: eachJob.package_per_annum,
    title: eachJob.title,
    rating: eachJob.rating,
  })

  getProfileDetails = async () => {
    this.setState({apiJobsStatus: apiUrlStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedFetchedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        apiStatus: apiUrlStatusConstants.success,
        profileDetails: updatedFetchedData,
      })
    } else {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  renderLoaderJobsView = () => (
    <div className="jobsList-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobsList = () => {
    this.getJobsList()
  }

  renderFailureJobsView = () => (
    <div className="jobs-failure-container">
      <img
        className="jobs-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-failure-title">Oops! Something Went Wrong</h1>
      <p className="job-failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button className="failure-btn" onClick={this.retryJobsList}>
        Retry
      </button>
    </div>
  )

  renderSuccessJobsListView = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            className="no-jobs-img"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1 className="no-jobs-title">No Jobs Found</h1>
          <p className="no-jobs-descp">
            We cannot find any jobs. Try another filters
          </p>
        </div>
      )
    } else {
      return (
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobItem eachJob={eachJob} key={eachJob.id} />
          ))}
        </ul>
      )
    }
  }

  renderJobsList = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoaderJobsView()
      case apiUrlStatusConstants.failure:
        return this.renderFailureJobsView()
      case apiUrlStatusConstants.success:
        return this.renderSuccessJobsListView()
      default:
        return null
    }
  }

  renderProfileLoaderView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div className="profile-success-container">
        <img className="profile-img" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  retryProfileDetails = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-view">
      <button className="failure-btn" onClick={this.retryProfileDetails}>
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderProfileLoaderView()
      case apiUrlStatusConstants.success:
        return this.renderProfileView()
      case apiUrlStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  updateActiveEmployementType = event => {
    this.setState(
      prev => ({
        activeEmployementId: [...prev.activeEmployementId, event.target.value],
      }),
      this.getJobsList,
    )
  }

  renderEmplomentList = () => {
    const {activeEmployementId} = this.state
    return (
      <div className="side-bar-list">
        <h1 className="list-title">Type of Employment</h1>
        <ul className="lists-container">
          {employmentTypesList.map(employeeType => (
            <li className="list-item" key={employeeType.employmentTypeId}>
              <input
                className="checkbox-input"
                checked={activeEmployementId.includes(
                  employeeType.employmentTypeId,
                )}
                type="checkbox"
                value={employeeType.employmentTypeId}
                onChange={this.updateActiveEmployementType}
              />
              <label className="list-label">{employeeType.label}</label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  updateActiveSalaryRange = event => {
    this.setState({activeSalarayRangeId: event.target.value}, this.getJobsList)
  }

  renderSalaryRangeList = () => {
    const {activeSalarayRangeId} = this.state
    return (
      <div className="side-bar-list">
        <h1 className="list-title">Salary Range</h1>
        <ul className="lists-container">
          {salaryRangesList.map(salary => (
            <li className="list-item" key={salary.salaryRangeId}>
              <input
                className="radio-input"
                checked={activeSalarayRangeId === salary.salaryRangeId}
                type="radio"
                value={salary.salaryRangeId}
                onChange={this.updateActiveSalaryRange}
              />
              <label className="list-label">{salary.label}</label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchGetJobsList = () => {
    this.getJobsList()
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="side-bar-container">
            <div className="profile-container">{this.renderProfile()}</div>
            <hr className="line" />
            {this.renderEmplomentList()}
            <hr className="line" />
            {this.renderSalaryRangeList()}
          </div>
          <div className="jobs-container">
            <div className="search-bar">
              <input
                className="search-input-box"
                value={searchInput}
                onChange={this.updateSearchInput}
                id="search"
                type="search"
                placeholder="Search"
              />
              <button
                className="search-icon-btn"
                data-testid="searchButton"
                type="button"
                onClick={this.onSearchGetJobsList}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-lists-container">{this.renderJobsList()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
