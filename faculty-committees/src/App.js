/////////////////////////////////////////////////////
// CIS 658 W25 Homework 11: React Parts 3 and 4
// Jack Wildes
/////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import "./App.css";

// Get name of the committee in a list
function Committee({ name }) {
  return <li>{name}</li>;
}

// Get the list of committees for a faculty member
function CommitteeList({ committees }) {
  return (
    <ul>
      {committees.map((committee, index) => (
        <Committee name={committee} key={index} />
      ))}
    </ul>
  );
}

// Set up and manage faculty data form (name, department, committees)
function FacultyForm({ onSave, faculty, onCancel }) {
  // Initialize state to either faculty’s existing information or empty details if adding new faculty
  const [formData, setFormData] = useState(
    faculty || { name: "", department: "", committees: [] }
  );

  // Set the faculty form data input values
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the submission of a faculty data form
  const handleSubmit = (e) => {
    e.preventDefault();
    const committeesArray = Array.isArray(formData.committees) 
        ? formData.committees 
        : formData.committees.split(",").map(c => c.trim());

    onSave({ ...formData, committees: committeesArray });
  };

  // Create form for faculty data (department, committees)
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
      <input type="text" name="committees" placeholder="Committees (comma-separated)" value={formData.committees} onChange={handleChange} />
      <button type="submit">Save</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

// Show or hide faculty member details (department, committees) on click
function FacultyMember({ faculty, onSave, onDelete }) {
  // Set default state for button expanded and editing
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Create togglers for expanding the faculty button and editing
  const toggleExpand = () => setExpanded(!expanded);
  const toggleEdit = () => setIsEditing(!isEditing);

  // Display faculty item where clicking toggles the display of faculty details; include edit form for faculty details
  return (
    <div className="faculty-item">
      <button onClick={toggleExpand} className="faculty-button">
        {expanded ? "▼" : "▶"} {faculty.name}
      </button>
      {expanded && (
        <div className="faculty-details">
          {isEditing ? (
            <FacultyForm 
              faculty={faculty} 
              onSave={(updatedFaculty) => { onSave(updatedFaculty); setIsEditing(false); }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <p><strong>Department:</strong> {faculty.department}</p>
              <h4>Committees:</h4>
              <CommitteeList committees={faculty.committees} />
              <button onClick={toggleEdit}>Edit</button>
              <button onClick={() => onDelete(faculty.id)}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Display full list of faculty
function FacultyList() {
  // Initialize state for the list of faculty members
  const [facultyList, setFacultyList] = useState([]);

  // Set fetch URL for API faculty data from Rails
  useEffect(() => {
    fetch("http://localhost:3001/faculties")
      .then(res => res.json())
      .then(setFacultyList)
      .catch(err => console.error("Error loading faculty:", err));
  }, []);

  // Update faculty list by either replacing existing faculty member or adding new faculty member with new id in the Rails API
  const saveFaculty = (newFaculty) => {
    const method = newFaculty.id ? "PUT" : "POST";
    const url = newFaculty.id
      ? `http://localhost:3001/faculties/${newFaculty.id}`
      : "http://localhost:3001/faculties";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFaculty),
    })
      .then(res => res.json())
      .then(updatedFaculty => {
        setFacultyList(prev =>
          newFaculty.id
            ? prev.map(fac => (fac.id === updatedFaculty.id ? updatedFaculty : fac))
            : [...prev, updatedFaculty]
        );
      });
  };

  // Delete faculty from the list in the Rails API
  const deleteFaculty = (id) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      fetch(`http://localhost:3001/faculties/${id}`, { method: "DELETE" })
        .then(() => setFacultyList(prev => prev.filter(fac => fac.id !== id)))
        .catch(err => console.error("Error deleting faculty:", err));
    }
  };

  // Display list of faculty, each having an editable form, and a separate form at the bottom to add new faculty
  return (
    <div className="faculty-list">
      <h1>College Faculty & Committees</h1>
      {facultyList.map(faculty => (
        <FacultyMember 
          key={faculty.id} 
          faculty={faculty} 
          onSave={saveFaculty} 
          onDelete={deleteFaculty} 
        />
      ))}
      <h2>Add New Faculty</h2>
      <FacultyForm onSave={saveFaculty} />
    </div>
  );
}

// Display full app faculty list data
export default function App() {
  return (
    <div className="App">
      <FacultyList />
    </div>
  );
}
