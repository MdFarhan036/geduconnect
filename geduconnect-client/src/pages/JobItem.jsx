import React from 'react';

const JobItem = ({ job }) => {
  return (
    <div className="job-item">
      <h3>{job.title}</h3>
      <p>Location: {job.location}</p>
      <p>Job Type: {job.type}</p>
      <p>Experience: {job.experience}</p>
      <p>Salary: {job.salary}</p>
      <a href='#applicationform'>
      <button className="apply-btn">Apply Now</button>
      </a>
    </div>
  );
};

export default JobItem;
