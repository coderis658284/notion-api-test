const apiUrl = "https://clam-proud-likely.ngrok-free.app/api/users";

async function editUser(id, name, email, role) {

  if (id) {
    await axios.put(`${apiUrl}/${id}`, userData);
    //alert("Update Successful!");
    Swal.fire({
      title: "Update Successful!",
      icon: "success",
      draggable: true,
    });
  }
}

async function loadData() {

  const queryString = window.location.search;
  console.log(queryString);
  const params = new URLSearchParams(queryString);
  const _id = params.get("id");

  console.log(_id);

  try {
    // get all data from the api
    const response = await axios.get(apiUrl, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    console.log("API response:", response.data); // <-- Check browser console here!

    const users = response.data;

    if (!Array.isArray(users)) {
      console.error("Response is not an array:", users);
      return;
    } else {
      // users
      const data_filter = users.filter((d) => d.id === _id);
      console.log("data_filter",data_filter);
      if (data_filter) {
        document.getElementById("userId").value = data_filter[0].id;
        document.getElementById("name").value = data_filter[0].name;
        document.getElementById("email").value = data_filter[0].email;
        document.getElementById("role").value = data_filter[0].role;
      }
    }
  } catch (error) {
    console.error("Axios error:", error);
  }
}


document.getElementById("userForm").onsubmit = async (e) => {
    e.preventDefault();
  
    const id = document.getElementById("userId").value;
    const userData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      role: document.getElementById("role").value,
    };
  
    try {
      if (id) {
        await axios.put(`${apiUrl}/${id}`, userData);
        //alert("Update Successful!");
        Swal.fire({
          title: "Update Successful!",
          icon: "success",
          draggable: true,
        });
      } else {
        await axios.post(apiUrl, userData);
        //alert("User Created Successfully!");
        Swal.fire({
          title: "User Created Successfully!",
          icon: "success",
          draggable: true,
        });
      }
  
      document.getElementById("userForm").reset();
      document.getElementById("userId").value = "";
      loadData();
      
    } catch (error) {
      //alert(error.response?.data?.error || 'Request failed');
      console.log(error)
      Swal.fire({
        title: error.response?.data?.error || "Request failed",
        icon: "success",
        draggable: true,
      });
    }
  };

loadData();
