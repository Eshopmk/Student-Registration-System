// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const courseDropdown = document.getElementById("course");
    const otherCourseInput = document.getElementById("otherCourseInput");
    const otherSkillCheckbox = document.getElementById("otherSkillCheckbox");
    const otherSkillInput = document.getElementById("otherSkillInput");
    const studentTable = document.getElementById("studentData");
  
    let editIndex = null; // To track the student being edited
  
    // Show/hide the "Other" input field for Course
    courseDropdown.addEventListener("change", () => {
      otherCourseInput.style.display = courseDropdown.value === "Other" ? "block" : "none";
    });
  
    // Show/hide the "Other" input field for Skills
    otherSkillCheckbox.addEventListener("change", () => {
      otherSkillInput.style.display = otherSkillCheckbox.checked ? "block" : "none";
    });
  
    // Load student records from localStorage
    function loadStudents() {
      const students = JSON.parse(localStorage.getItem("students")) || [];
      studentTable.innerHTML = "";
      students.forEach((student, index) => addRow(student, index));
    }
  
    // Add a new row to the table
    function addRow(data, index) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.contact}</td>
        <td>${data.gender}</td>
        <td>${data.course}</td>
        <td>${data.skills.join(", ")}</td>
        <td>
          <button onclick="editStudent(${index})">Edit</button>
          <button onclick="deleteStudent(${index})">Delete</button>
        </td>
      `;
      studentTable.appendChild(row);
    }
  
    // Field validation function
    function isValid({ id, name, email, contact }) {
      const nameRegex = /^[A-Za-z\s]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const numRegex = /^\d+$/;
  
      if (!id || !numRegex.test(id)) return alert("Enter valid numeric Student ID.");
      if (!name || !nameRegex.test(name)) return alert("Name must contain only letters.");
      if (!email || !emailRegex.test(email)) return alert("Invalid email address.");
      if (!contact || !numRegex.test(contact)) return alert("Enter valid numeric Contact.");
      return true;
    }
  
    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const id = document.getElementById("studentId").value.trim();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const contact = document.getElementById("contact").value.trim();
      const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
      const course = courseDropdown.value === "Other" ? otherCourseInput.value.trim() : courseDropdown.value;
  
      const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
        .map(cb => cb.value !== "Other" ? cb.value : otherSkillInput.value.trim());
  
      // Validate fields
      if (!isValid({ id, name, email, contact })) return;
      if (!gender || !course || skills.length === 0 || skills.includes("")) {
        return alert("Please complete all required fields.");
      }
  
      const newStudent = { id, name, email, contact, gender, course, skills };
      const students = JSON.parse(localStorage.getItem("students")) || [];
  
      // Update or add new record
      if (editIndex !== null) {
        students[editIndex] = newStudent;
        editIndex = null;
      } else {
        students.push(newStudent);
      }
  
      // Save to localStorage and reload
      localStorage.setItem("students", JSON.stringify(students));
      form.reset();
      otherCourseInput.style.display = "none";
      otherSkillInput.style.display = "none";
      loadStudents();
    });
  
    // Make editStudent globally accessible
    window.editStudent = function (index) {
      const students = JSON.parse(localStorage.getItem("students")) || [];
      const student = students[index];
  
      // Prefill form with selected student
      document.getElementById("studentId").value = student.id;
      document.getElementById("name").value = student.name;
      document.getElementById("email").value = student.email;
      document.getElementById("contact").value = student.contact;
      document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
  
      // Handle course
      if (["BTech", "BCA"].includes(student.course)) {
        courseDropdown.value = student.course;
        otherCourseInput.style.display = "none";
      } else {
        courseDropdown.value = "Other";
        otherCourseInput.style.display = "block";
        otherCourseInput.value = student.course;
      }
  
      // Reset and assign skills
      document.querySelectorAll('input[name="skills"]').forEach(cb => cb.checked = false);
      otherSkillInput.value = "";
      otherSkillInput.style.display = "none";
  
      student.skills.forEach(skill => {
        const checkbox = document.querySelector(`input[name="skills"][value="${skill}"]`);
        if (checkbox) checkbox.checked = true;
        else {
          otherSkillCheckbox.checked = true;
          otherSkillInput.style.display = "block";
          otherSkillInput.value = skill;
        }
      });
  
      editIndex = index;
    };
  
    // Make deleteStudent globally accessible
    window.deleteStudent = function (index) {
      if (!confirm("Are you sure you want to delete this record?")) return;
      const students = JSON.parse(localStorage.getItem("students")) || [];
      students.splice(index, 1);
      localStorage.setItem("students", JSON.stringify(students));
      loadStudents();
    };
  
    // Load on first render
    loadStudents();
  });
  