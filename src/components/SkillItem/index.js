import './index.css'

const SkillItem = props => {
  const {eachSkill} = props
  const {imageUrl, name} = eachSkill
  return (
    <li className="skill-item">
      <img className="skill-img" alt="skill" src={imageUrl} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default SkillItem
