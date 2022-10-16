// see SignupForm.js for comments
import React, { useState } from "react";
import { Box, Button, TextField, Alert } from "@mui/material";

import { loginUser } from "../utils/API";
import Auth from "../utils/auth";

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await loginUser(userFormData);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { token, user } = await response.json();
      console.log(user);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        validated={validated} 
        onSubmit={handleFormSubmit}
        autoComplete="off"
      >
        <Alert severity="error" dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <div>
          <TextField
            error
            id="outlined-error-helper-text"
            type="text"
            label="Email"
            placeholder="Please enter your email"
            name="email"
            helperText="A valid Email is required."
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <TextField
            error
            id="outlined-error-helper-text"
            label="Password"
            name="password"
            placeholder="Please enter a Password"
            helperText="A valid Password is required."
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
        </div>
    
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='outlined'>
          Submit
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;