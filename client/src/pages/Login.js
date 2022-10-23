import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {validateEmail } from "../utils/helpers";
import { Link, useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from "../utils/auth";

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '', showPassword: false});
  const [showAlert, setShowAlert] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState(false);
  const [loginUser, { error, data }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if( name === "password") {
      if(!value) {
        setPasswordError(true);
        setPasswordHelperText("A Valid Password is required");
      } else if (value) {
        setPasswordError(false);
        setPasswordHelperText(false);
      }
    } 
    setUserFormData({ 
      ...userFormData, 
      [name]: value 
    });
  };

  const handleClickShowPassword = () => {
    setUserFormData({
      ...userFormData,
      showPassword: !userFormData.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const isValid = validateEmail(event.target.value);
    if (name === "email") {
      if(!isValid) {
        setEmailError(true);
        setEmailHelperText("A Valid Email is required");
      } else if (isValid) {
        setEmailError(false);
        setEmailHelperText(false);
      }
    } else if( name === "password") {
      if(!value) {
        setPasswordError(true);
        setPasswordHelperText("A Valid Password is required");
      } else if (value) {
        setPasswordError(false);
        setPasswordHelperText(false);
      }
    } 
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await loginUser({ 
        variables: { ...userFormData } 
      });
      Auth.login(data.login.token);

    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    navigate("/profile");

    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <Container maxWidth="sm" alignItems="center">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          flexGrow: 1,
        }}
        noValidate
        onSubmit={handleFormSubmit}
        autoComplete="off"
      > 
        <Grid container sx={{display: 'flex', justifyContent:"center"}}>
            <Card sx={{ maxWidth: 1000 }}>
              <CardMedia
                component="img"
                alt="sparks_login_background"
                image={process.env.PUBLIC_URL + '/assets/images/LoginCardBkg-unsplash.jpg'}
                />
              <CardContent>
                <InputLabel htmlFor="outlined-adornment-amount">Email</InputLabel>
                  <TextField
                    id="outlined-error-helper-text"
                    // label="Email"
                    type="email"
                    name="email"
                    placeholder="Please enter your email"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    value={userFormData.email}
                    error={emailError}
                    helperText={emailHelperText}
                    required
                  />
                <InputLabel htmlFor="outlined-adornment-amount">Password</InputLabel>
                  <OutlinedInput
                    sx={{m:1}}
                    id="outlined-adornment-password-error-helper-text"
                    type={userFormData.showPassword ? "text" : "password"}
                    name="password"
                    // label="Password"
                    placeholder="Please enter a Password"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    value={userFormData.password}
                    error={passwordError}
                    helperText={passwordHelperText}
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                        {userFormData.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
              </CardContent>
              {showAlert && 
              <Alert severity="error" onClose={() => {setShowAlert(false)}}>
                Computer says no! It doesn't like your incorrect login details!
              </Alert>}
              <div>
                <Button
                  disabled={!(userFormData.email && userFormData.password)}
                  type='submit'
                  variant='outlined'
                  sx={{ width: '25ch' }}
                  onSubmit={handleFormSubmit}
                  >
                  Log In
                </Button>
              </div>
              <Stack direction="row">
                <hr></hr>
                <div>OR</div>
                <hr></hr>
              </Stack>
              <br/>
              <Typography>Don't Have an Account? 
                <Link to="/signup"> Sign Up</Link>
              </Typography>
              <br />
            </Card>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginForm;
