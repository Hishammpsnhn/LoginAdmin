async function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
      const response = await fetch(`/admin/${id}`, { method: "DELETE" });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const elem = document.getElementById(data.user._id);
        if (elem) elem.remove();
      }
    }
  }
  async function handleEdit(id) {
    console.log("edit", id);
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    try {
      const response = await fetch(`/admin/user/${id}`, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        console.log(data.user.userName);

        console.log(name, email);
        name.value = data.user.userName;
        email.value = data.user.email;
      }

      const btn = document.getElementById("updateUser");
      const nameData = name.value;
      const emailData = email.value;

      btn.addEventListener("click", async function () {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const userData = { userName: name, email: email };
        try {
          const response = await fetch(`/admin/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          if (response.ok) {
            const data = await response.json();
            const row = document.getElementById(id);
            console.log(row);
            if (row) {
              row.querySelector("td:nth-child(2)").textContent =
                data.user.userName;
              row.querySelector("td:nth-child(3)").textContent =
                data.user.email;
            }
            const modalElement = document.getElementById("exampleModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  let debounceTimeout;

  // Debounce function
  function debounce(func, delay) {
    return function (...args) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  async function handleSearch() {
    const query = document.getElementById("searchInput").value;
    const tableBody = document.getElementById("userTableBody");
    console.log(query);
    if (query.trim()) {
      const response = await fetch(
        `/admin/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        tableBody.innerHTML = "";

        data.user.forEach((item) => {
          const row = document.createElement("tr");
          row.id = item._id;

          row.innerHTML = `
          <th scope="row">${item._id}</th>
          <td>${item.userName}</td>
          <td>${item.email}</td>
          <td>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onclick="handleEdit('${item._id}')"
            >
              Edit
            </button>
          </td>
          <td>
            <button
              onclick="deleteUser('${item._id}')"
              type="button"
              class="btn btn-danger"
            >
              Delete
            </button>
          </td>
        
        `;
          tableBody.appendChild(row);
        });
      }
    } else {
      // Clear the results if the input is empty
      document.getElementById("results").innerHTML = "";
    }
  }

  // Create a debounced version of handleSearch
  const debouncedHandleSearch = debounce(handleSearch, 400); 

  // Attach the debounced function to the input event
  document
    .getElementById("searchInput")
    .addEventListener("input", debouncedHandleSearch);