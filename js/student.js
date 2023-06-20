let studentCardRow = document.querySelector(".student_row");
let isWorking = document.querySelector(".isworking_filter");
let birthdayFiltering = document.querySelector(".select-student");
let searchInput = document.querySelector('.input');
let studentForm = document.querySelector(".student_form");
let addBtn = document.querySelector(".add-teacher");
let submitBtn = document.querySelector(".submit-button");
const teacherOptions = document.getElementById("teacherOptions");
let studentFormElements = studentForm.elements;
console.log(studentFormElements);

// const axiosInstance = axios.create({
//     baseURL: 'https://649044a11e6aa71680caeb2e.mockapi.io/',
//     timeout: 10000,
// });

const query = new URLSearchParams(location.search);
const teacherId = query.get("teacher");

// initial values
let selected = null;
let ageOrder = '';
let search = "";


function getStudents({
  avatar,
  firstName,
  email,
  phoneNumber,
  isWork,
  age,
  field,
  teacherId,
  id,
}) {
  return `
      <div class="card">
              <div class="box">
                  <video
                  src="../"
                  poster="${avatar}" 
                  type="video/mp4"
                  autoplay
                  muted
                  loop
                  ></video>
              </div>
              <div class="box">
              <div class="content">
                  <h1 class = "clamp">${firstName}, <span class="email">${email}</span></h1>
                  <p class="phone"><span class="phone_title">Phone:</span> <span class="tell">${phoneNumber}</span></p>
                  <ul>
                  <li>
                      <div class="info-box">Field <span>${field}</span></div>
                  </li>
                  <li>
                      <div class="info-box">Age <span>${age} old</span></div>
                  </li>
                  <li>
                      <div class="info-box">Is Work<span>${
                        isWork ? "Yes" : "No"
                      }</span></div>
                  </li>
                  </ul>
                  <div class="cta">
                  <a class="btn">Students</a>
                  <button class="btn" onclick="editStudent(${teacherId, id})">Edit</button>
                  <button class="btn" onclick = "deleteStudent(${ teacherId, id})">Delete</button>
                  </div>
              </div>
              </div>
              <div class="circle">
              <img src="${avatar}" alt="" />
              </div>
          </div>
      `;
}

function getStudentsData(teacherId) {
  const queryParamsSecond = {
    firstName: search,
    sortBy: "firstName",
    order: ageOrder,
  };

  axiosInstanceStudent
    .get(`${teacherId}/student`, { params: queryParamsSecond })
    .then((response) => {
      let students = response.data;
      axiosInstanceStudent(`student?firstName=${search}`).then((res) => {
        pagination();
      });
      studentCardRow.innerHTML = "";
      students.map((el) => {
        studentCardRow.innerHTML += getStudents(el);
      });
      pagination();
    })
    .catch((error) => {
      console.error(error);
    });
}
getStudentsData(teacherId);

async function getAllStudents() {
  try {
    const teacherResponse = await axiosInstance.get("/teacher");
    const teachers = teacherResponse.data;

    for (const teacher of teachers) {
      const teacherId = teacher.id;
      const studentResponse = await axiosInstance.get(
        `/teacher/${teacherId}/student`
      );
      const students = studentResponse.data;
      students.map((el) => {
        studentCardRow.innerHTML += getStudents(el);
      });
      console.log(`Students for teacher ID ${teacherId}:`, students);
    }
  } catch (error) {
    console.error(error);
  }
  pagination();
}

axiosInstance
  .get("teacher")
  .then((response) => {
    let teachers = response.data;
    const selectDropdown = document.getElementById("select-4");
    teachers.forEach((teacher) => {
      const option = document.createElement("option");
      option.value = teacher.id;
      option.textContent = teacher.firstName;
      selectDropdown.appendChild(option);
    });

    selectDropdown.addEventListener("change", function () {
      const selectedTeacherId = selectDropdown.value;
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("teacher", selectedTeacherId);
      history.pushState(null, "", newUrl);
      // if (selectedTeacherId === "0") {
      //   getAllStudents();
      // } else {
        const selectedTeacher = teachers.find(
          (teacher) => teacher.id === selectedTeacherId
          );
          if (selectedTeacher) {
            filterStudentsByTeacher(selectedTeacher);
          }
        // }
        
    });

    function filterStudentsByTeacher(teacher) {
      axiosInstance
        .get(`teacher/${teacher.id}/student`)
        .then((response) => {
          let students = response.data;
          studentCardRow.innerHTML = "";
          students.map((el) => {
            studentCardRow.innerHTML += getStudents(el);
          });
          pagination();
          console.log(students);
        })
        .catch((error) => {
          console.error(error);
        });
        
    }
  })
  .catch((error) => {
    console.error(error);
  });

// pagination
function pagination() {
  const items = $(".student_row .card");
  const numItems = items.length;
  const perPage = 3;

  items.slice(perPage).hide();

  $("#pagination-container").pagination({
    items: numItems,
    itemsOnPage: perPage,
    prevText: "&laquo;",
    nextText: "&raquo;",
    onPageClick: function (pageNumber) {
      const showFrom = perPage * (pageNumber - 1);
      const showTo = showFrom + perPage;
      items.hide().slice(showFrom, showTo).show();
    },
  });
}

// isWorking
isWorking.addEventListener("change", function () {
  let isWorkingValue = isWorking.value;

  axiosInstance.get(`/teacher/${teacherId}/student`, {params: {isWork: isWorkingValue === "false" ? true: isWorkingValue === "true" ? false: "",},
    })
    .then((response) => {
      const filteredStudents = response.data;
      studentCardRow.innerHTML = "";
      pagination()
      filteredStudents.map((el) => {
        studentCardRow.innerHTML += getStudents(el);
      })
    })
    .catch((error) => {
      console.error(error);
    });
});

// age filtering
birthdayFiltering.addEventListener("change", function(){
    let filtering = birthdayFiltering.value;
    ageOrder = filtering === "asc" ? "asc" : filtering === "desc" ? "desc" : "";

    getStudentsData(teacherId);
})

// searching
searchInput.addEventListener("keyup", function () {
    search = this.value;
    console.log(search);
    getStudentsData(teacherId)
  });


// add student part
studentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const firstName = studentFormElements.firstName.value;
    const lastName = studentFormElements.lastName.value;
    const avatar = studentFormElements.avatar.value;
    const email = studentFormElements.email.value;
    const phoneNumber = studentFormElements.phoneNumber.value;
    const isWork = studentFormElements.isWork.checked;
    const phoneNumberRegex = /^\+\d{12}$/;
    const isValidPhoneNumber = phoneNumberRegex.test(phoneNumber);
  
    if (!isValidPhoneNumber) {
      alert("Invalid phone number");
      return;
    }
    let data = {firstName, avatar, lastName, email, phoneNumber, isWork};
  
    console.log(teacherId);
    console.log(data);
    if (selected === null) {
      console.log(teacherId);
        axiosInstance.post(`teacher/${teacherId}/student`, data).then((res) => {
            console.log('Student added successfully:', res.data);
            studentForm.reset();
            closeModal();
            getStudentsData(teacherId);
      });
  
    } else {
      axiosInstance.put(`teacher/${teacherId}/student/${selected}`, data).then((res) => {
        closeModal();
        getStudentsData(teacherId);
      });
    }
  });

  addBtn.addEventListener("click", function () {
  selected = null;
  submitBtn.innerHTML = "Add Student";
  studentForm.reset();
});

async function editStudent( id) {
  selected = id;  
  console.log(selected);
  let students = await axiosInstance(`teacher/${teacherId}/student/${id}`);
  studentFormElements.firstName.value = students.data.firstName;
  studentFormElements.lastName.value = students.data.lastName;
  studentFormElements.phoneNumber.value = students.data.phoneNumber;
  studentFormElements.avatar.value = students.data.avatar;
  studentFormElements.email.value = students.data.email;
  studentFormElements.isWork.checked = students.data.isWork;
  submitBtn.innerHTML = "Save Changes";
  console.log(studentFormElements);
  closeModal();
  console.log(id);
}


async function deleteStudent(id) {
  let check = confirm("Do you want to delete this category ?");
  if (check) {
    await axiosInstance.delete(`teacher/${teacherId}/student/${id}`);
    getStudentsData(teacherId);
  }
}