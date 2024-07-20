import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {
  BsFillStarFill,
  BsBoxArrowUpRight,
  BsBriefcaseFill,
  BsGeoAlt,
} from 'react-icons/bs'
import Header from '../Header'
import SkillItem from '../SkillItem'
import SimilarJob from '../SimilarJob'
import './index.css'

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}
class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    skillsList: [],
    apiStatus: apiUrlStatusConstants.initial,
    similarJobsList: [],
  }

  componentDidMount = () => {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedFetchedData = this.getUpdatedJobDetails(
        fetchedData.job_details,
      )
      const updatedSkillsList = fetchedData.job_details.skills.map(
        eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        }),
      )
      const updatedSimilarJobs = fetchedData.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        apiStatus: apiUrlStatusConstants.success,
        jobDetails: updatedFetchedData,
        skillsList: updatedSkillsList,
        similarJobsList: updatedSimilarJobs,
      })
    } else {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  getUpdatedJobDetails = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  renderLoaderJobDetailView = () => (
    <div className="job-detail-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobDetails = () => {
    this.getJobDetails()
  }

  renderFailureJobDetailView = () => (
    <div className="job-detail-failure-container">
      <img
        className="job-detail-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-detail-failure-title">Oops! Something Went Wrong</h1>
      <p className="job-detail-failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button className="job-detail-failure-btn" onClick={this.retryJobDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccessJobDetailView = () => {
    const {jobDetails, skillsList, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      location,
      rating,
      jobDescription,
      title,
      lifeAtCompany,
      employmentType,
      packagePerAnnum,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <div className="jobs-details-card">
          <div className="job-detail-header">
            <img
              className="job-detail-logo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div className="job-detail-header-title">
              <h1 className="job-detail-title">{title}</h1>
              <div className="job-detail-rating-container">
                <BsFillStarFill className="job-detail-star" />
                <p className="job-detail-title">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-detail-details">
            <div className="job-detail-details-content">
              <BsGeoAlt className="job-detail-icon" />
              <p className="job-detail-descp">{location}</p>
              <BsBriefcaseFill className="job-detail-icon" />
              <p className="job-detail-descp">{employmentType}</p>
            </div>
            <h1 className="job-detail-title">{packagePerAnnum}</h1>
          </div>
          <hr className="job-detail-line" />
          <div className="job-descp-content">
            <h1 className="job-detail-title">Description</h1>
            <a className="job-detail-achor" href={companyWebsiteUrl}>
              Visit <BsBoxArrowUpRight />
            </a>
          </div>
          <p className="job-detail-descp">{jobDescription}</p>
          <h1 className="job-detail-title">Skills</h1>
          <ul className="job-detail-skills-list">
            {skillsList.map(eachSkill => (
              <SkillItem eachSkill={eachSkill} />
            ))}
          </ul>
          <h1 className="job-detail-title">Life At Company</h1>
          <div className="job-detail-life-at-company-section">
            <p className="job-detail-descp">{description}</p>
            <img
              className="job-detail-life-company-img"
              src={imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="job-detail-title">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsList.map(eachJob => (
            <SimilarJob eachJob={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoaderJobDetailView()
      case apiUrlStatusConstants.success:
        return this.renderSuccessJobDetailView()
      case apiUrlStatusConstants.failure:
        return this.renderFailureJobDetailView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
