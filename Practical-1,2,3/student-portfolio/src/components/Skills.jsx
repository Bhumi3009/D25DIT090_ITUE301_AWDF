function Skills({ skillList }) {
  return (
    <div className="bento-card span-3" id="skills">
      <p className="card-number">05</p>
      <h2 className="card-title">Skills</h2>
      <div className="skills-groups">
        {skillList.map((group) => (
          <div key={group.category}>
            <p className="skill-group-title">
              <span className="skill-dot" style={{ background: group.color }}></span>
              {group.category}
            </p>
            <div className="skill-tags">
              {group.skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills