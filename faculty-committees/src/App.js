/////////////////////////////////////////////////////
// CIS 658 W25 Homework 10: React Parts 1 and 2
// Jack Wildes
/////////////////////////////////////////////////////

import React, { useState } from "react";
import "./App.css";

// Using made-up faculty and committees for now (non-GVSU specific)
const facultyData = [
  {
    id: 1,
    name: "Dr. James Smith",
    department: "CIS",
    committees: ["Curriculum Committee", "Technology Committee"],
  },
  {
    id: 2,
    name: "Dr. John Doe",
    department: "Mathematics",
    committees: ["Scholarships Committee", "Hiring Committee"],
  },
  {
    id: 3,
    name: "Dr. Jane Doe",
    department: "Physics",
    committees: ["Research Committee"],
  },
  {
    id: 4,
    name: "Dr. Jill Smith",
    department: "Nursing",
    committees: ["Scholarships Committee"],
  }
];

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
    faculty || { name: "", department: "", committees: "" }
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
function FacultyMember({ faculty, onSave }) {
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
  const [facultyList, setFacultyList] = useState(facultyData);

  // Update faculty list by either replacing existing faculty member or adding new faculty member with new id
  const saveFaculty = (newFaculty) => {
    setFacultyList((prev) => {
      if (newFaculty.id) {
        return prev.map(fac => (fac.id === newFaculty.id ? newFaculty : fac));
      }
      return [...prev, { ...newFaculty, id: prev.length + 1 }];
    });
  };

  // Display list of faculty, each having an editable form, and a separate form at the bottom to add new faculty
  return (
    <div className="faculty-list">
      <h1>College Faculty & Committees</h1>
      {facultyList.map(faculty => (
        <FacultyMember key={faculty.id} faculty={faculty} onSave={saveFaculty} />
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
