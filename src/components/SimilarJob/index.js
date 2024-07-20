import {BsFillStarFill, BsBriefcaseFill, BsGeoAlt} from 'react-icons/bs'
import './index.css'

const SimilarJob = props => {
  const {eachJob} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = eachJob
  return (
    <li className="similar-job-item">
      <div className="similar-job-header">
        <img
          className="similar-job-logo"
          src={companyLogoUrl}
          alt="company logo"
        />
        <div className="similar-job-header-title">
          <h1 className="similar-job-title">{title}</h1>
          <div className="similar-job-rating-container">
            <BsFillStarFill className="similar-job-star" />
            <p className="similar-job-title">{rating}</p>
          </div>
        </div>
      </div>
      <div className="similar-job-details">
        <div className="similar-job-details-content">
          <BsGeoAlt className="similar-job-icon" />
          <p className="similar-job-descp">{location}</p>
          <BsBriefcaseFill className="similar-job-icon" />
          <p className="similar-job-descp">{employmentType}</p>
        </div>
      </div>
      <hr className="similar-job-line" />
      <h1 className="similar-job-title">Description</h1>
      <p className="similar-job-descp">{jobDescription}</p>
    </li>
  )
}

export default SimilarJob
