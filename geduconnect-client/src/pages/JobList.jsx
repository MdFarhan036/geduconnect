import React from 'react';
import JobItem from './JobItem';

// Example job data
const jobs = [
  { id: 1, title: 'Admission Counsellor', location: 'Jaipur, Rajasthan', type: 'Full-time', salary: '15000-20000', experience: '6 months - 12 months' },
  { id: 2, title: 'Team Leader', location: 'Jaipur, Rajasthan', type: 'Full-time', salary: '20000-25000', experience: '18 months - 24 months' },
  { id: 3, title: 'Business Development Executive', location: 'Jaipur, Rajasthan', type: 'Full-time', salary: '15000-20000', experience: '6 months - 12 months' },
  { id: 4, title: 'Center Representative Ofiicer', location: 'Jaipur, Rajasthan', type: 'Full-time', salary: '15000-20000', experience: '6 months - 12 months' },
  { id: 5, title: 'Graphic Designer', location: 'Jaipur, Rajasthan', type: 'Full-time', salary: '20000-25000', experience: '12 months - 24 months' },
  { id: 6, title: 'Web Developer', location: 'Jaipur, Rajasthan', type: 'Full-time', salary: '15000-20000', experience: '12 months - 24 months' },
];

const JobList = () => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
