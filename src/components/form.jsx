import React, { useState } from "react";
import axios from "axios";

const Formpage = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData, 
      [e.target.name]: e.target.value, 
    });
  };//name --> common for all fields & ...formData stores the old values or keep the previous state

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        formData
      );
      
      setMessage(response.data.message);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      setMessage("Signup Failed. Please try again.");
    }
  };

  return (
    <div style={{ width: "350px", margin: "auto", marginTop: "50px" }}>
      <h2>Signup Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
          }}
        >
          Signup
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Formpage;
