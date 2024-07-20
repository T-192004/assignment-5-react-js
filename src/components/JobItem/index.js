import {Link} from 'react-router-dom'
import {BsFillStarFill, BsBriefcaseFill, BsGeoAlt} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {eachJob} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJob
  return (
    <Link to={`/jobs/${id}`} className="jobs-item-link">
      <li className="job-item">
        <div className="job-item-header">
          <img
            className="job-item-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="job-header-title">
            <h1 className="job-item-title">{title}</h1>
            <div className="job-item-rating-container">
              <BsFillStarFill className="job-item-star" />
              <p className="job-item-title">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-details">
          <div className="job-item-details-content">
            <BsGeoAlt className="job-item-icon" />
            <p className="job-item-descp">{location}</p>
            <BsBriefcaseFill className="job-item-icon" />
            <p className="job-item-descp">{employmentType}</p>
          </div>
          <h1 className="job-item-title">{packagePerAnnum}</h1>
        </div>
        <hr className="job-item-line" />
        <h1 className="job-item-title">Description</h1>
        <p className="job-item-descp">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
