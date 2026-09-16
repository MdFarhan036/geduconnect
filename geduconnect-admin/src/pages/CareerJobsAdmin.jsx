import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";

const emptyJob = {
  position: "",
  location: "",
  experience: "",
  salary_range: "",
  is_active: 1
};

export default function CareerJobsAdmin() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchJobs = async () => {
    const res = await api.get("/careers/admin/jobs");
    setJobs(res.data.jobs || []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreate = () => {
    setForm(emptyJob);
    setEditingId(null);
    setOpen(true);
  };

  const editJob = job => {
    setForm({
      position: job.position,
      location: job.location,
      experience: job.experience,
      salary_range: job.salary_range,
      is_active: job.is_active
    });
    setEditingId(job.id);
    setOpen(true);
  };

  const saveJob = async () => {
    if (editingId) {
      await api.put(`/careers/admin/jobs/${editingId}`, form);
    } else {
      await api.post("/careers/admin/jobs", form);
    }

    setOpen(false);
    setForm(emptyJob);
    setEditingId(null);
    fetchJobs();
  };

  const deleteJob = async id => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await api.delete(`/careers/admin/jobs/${id}`);
      fetchJobs();
    }
  };

  return (
    <div className="highlight-admin">
      <div className="page-header">
        <h2>Manage Jobs</h2>
        <button className="btn primary" onClick={openCreate}>
          + Add Job
        </button>
      </div>

      {/* Job List */}
      <div className="admin-card">
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.position}</td>
                <td>{job.location}</td>
                <td>{job.experience}</td>
                <td>{job.salary_range}</td>
                <td>{job.is_active ? "Open" : "Closed"}</td>
                <td>
                  <button onClick={() => editJob(job)}>Edit</button>
                  <button onClick={() => deleteJob(job.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal
        open={open}
        title={editingId ? "Edit Job" : "Add Job"}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn primary" onClick={saveJob}>
              {editingId ? "Update Job" : "Create Job"}
            </button>
          </>
        }
      >
        <input
          placeholder="Position"
          value={form.position}
          onChange={e =>
            setForm({ ...form, position: e.target.value })
          }
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={e =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          placeholder="Experience"
          value={form.experience}
          onChange={e =>
            setForm({ ...form, experience: e.target.value })
          }
        />

        <input
          placeholder="Salary Range"
          value={form.salary_range}
          onChange={e =>
            setForm({ ...form, salary_range: e.target.value })
          }
        />

        <label style={{ marginTop: 10 }}>
          <input
            type="checkbox"
            checked={form.is_active === 1}
            onChange={e =>
              setForm({
                ...form,
                is_active: e.target.checked ? 1 : 0
              })
            }
          />
          Active
        </label>
      </Modal>
    </div>
  );
}