function encodeImageFileAsURL(element, callback) {
  let file = element.files[0];
  let reader = new FileReader();

  reader.onloadend = function () {
    let encodedURL = reader.result;
    callback(encodedURL);
  };

  reader.readAsDataURL(file);
}

function displayImage(element) {
  encodeImageFileAsURL(element, function (encodedURL) {
    let image = document.getElementById("output");
    image.src = encodedURL;
  });
}

// toggle between add and edit mode
let editMode = false;
let editingRow = null;

// function to switch to add mode
function addMode() {
  editMode = false;
  document.getElementById("userForm").reset();
  document.getElementById("output").src = "user.jpg";
  document.getElementById("submitBtn").value = "Add";
}

// function to swtich to edit mode
function updateMode(row) {
  editMode = true;
  // set the data from row
  const image = row.querySelector("td:nth-child(1) img").src;
  const name = row.querySelector("td:nth-child(2)").textContent;
  const email = row.querySelector("td:nth-child(3)").textContent;
  const company = row.querySelector("td:nth-child(4)").textContent;
  const age = row.querySelector("td:nth-child(5)").textContent;

  // set the data to the form inputs for updating
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("company").value = company;
  document.getElementById("age").value = age;
  document.getElementById("output").src = image;

  document.getElementById("submitBtn").value = "Update";
}

// function to update row with new data
function updateRow(row) {
  console.log(row);
  const cells = row.cells;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const age = document.getElementById("age").value;
  const image = document.getElementById("output").src;

  // Update the cell values with the edited data
  cells[1].textContent = name;
  cells[2].textContent = email;
  cells[3].textContent = company;
  cells[4].textContent = age;

  // Update the image in the row
  const imageCell = cells[0];
  const imageElement = imageCell.querySelector("img");
  imageElement.src = image;

  // Switch back to add mode
  addMode();

  editingRow = null;
}

//function to add the user
function addUpdate(event) {
  // prevents form submitting
  event.preventDefault();

  // input values of form
  let imageurl = "";
  if (editMode) {
    imageurl = document.getElementById("output").src;
  } else {
    if (document.getElementById("image").files[0]) {
      imageurl = document.getElementById("output").src;
    } else {
      imageurl = "";
    }
  }
  const image = imageurl;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const age = document.getElementById("age").value;

  // check if name is valid
  if (name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
    alert("Please enter a valid name!");
    return;
  }

  // check if email is valid
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  // function to check if email format is correct
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // check if age is valid
  if (isNaN(age) || age < 1) {
    alert("Please enter a valid age!");
    return;
  }

  // check if age is valid
  if (!image) {
    alert("Please select the image!");
    return;
  }

  // create a new table row
  let row;
  console.log(editMode);
  if (editMode) {
    updateRow(editingRow);
  } else {
    row = document.createElement("tr");

    // table cells for name, email, company, age, and image
    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const emailCell = document.createElement("td");
    emailCell.textContent = email;

    const companyCell = document.createElement("td");
    companyCell.textContent = company;

    const ageCell = document.createElement("td");
    ageCell.textContent = age;

    const imageCell = document.createElement("td");
    const imageElement = document.createElement("img");
    imageElement.src = image;
    imageElement.classList.add("user-image");
    imageCell.appendChild(imageElement);

    // action buttons
    const actionCell = document.createElement("td");

    // edit button
    const editButton = document.createElement("span");
    editButton.textContent = "edit";
    editButton.classList.add("material-symbols-outlined", "edit");

    // delete button
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "delete";
    deleteButton.classList.add("material-symbols-outlined", "delete");

    // add event listeners to icons
    editButton.addEventListener("click", function () {
      const row = this.closest("tr");
      editingRow = row;
      updateMode(row);
    });
    deleteButton.addEventListener("click", deleteUser);

    // append icons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    // append cells to  row
    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(companyCell);
    row.appendChild(ageCell);
    row.appendChild(actionCell);

    const table = document
      .getElementById("usertable")
      .getElementsByTagName("tbody")[0];
    table.appendChild(row);

    addMode();
  }
}

// delete the user
function deleteUser() {
  console.log("deleted");
  // user for which the delete button is clicked
  const user = this.closest("tr");
  // remove the user row from table
  user.remove();
}

// add event listener to the form submission
document.getElementById("userForm").addEventListener("submit", addUpdate);
