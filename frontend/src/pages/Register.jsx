import React, { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from "react-google-recaptcha";
import PopUpModal from "./PopUpModal";
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [open, setOpen] = useState(false);
  const [popUpContent, setPopupContent] = useState({ title: "", message: "", option: "" });
  
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    recaptchaToken: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recaptchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { ...formData, recaptchaToken }
      );
      handleOpen();
      setPopupContent({
        title: "Success",
        message: `${formData.name}, your account has been created successfully`,
        option: "Ok"
      });
    } catch (error) {
      handleOpen();
      setPopupContent({
        title: "Something went wrong",
        message: "Couldn't create the user",
        option: "Try again"
      });
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response;
      if (!credential) {
        throw new Error('Invalid Google credential');
      }
      await axios.post("http://localhost:5000/api/auth/google", {
        tokenId: credential
      });
      handleOpen();
      setPopupContent({
        title: "Success",
        message: "Google account linked successfully",
        option: "Ok"
      });
      navigate('/dashboard');
    } catch (error) {
      handleOpen();
      setPopupContent({
        title: "Something went wrong",
        message: "Couldn't link Google account",
        option: "Try again"
      });
    }
  };
  

  const handleGoogleError = (error) => {
    console.error(error);
    handleOpen();
    setPopupContent({
      title: "Error",
      message: "Google Sign-In failed",
      option: "Try again"
    });
  };

  const recaptchaRef = React.createRef();

  return (
    <>
      <Header />

      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 5,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Add New Employee
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            <Button
              sx={{
                marginTop: 2,
                backgroundColor: "#1976d2",
                color: "#fff",
              }}
              fullWidth
              type="submit"
              variant="contained"
            >
              Register
            </Button>

            {/* Google Sign-In Button */}
            <GoogleOAuthProvider clientId="743701796177-omdirq2r4vtlpmm83m69q4i2msvp1n5p.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                buttonText="Sign up with Google"
              />
            </GoogleOAuthProvider>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LdciEgqAAAAAAqFmkcwIvs3Vir1LkCMulk_FsRj"
              size="invisible"
            />
          </form>
        </Box>

        <PopUpModal
          open={open}
          onClose={handleClose}
          title={popUpContent.title}
          message={popUpContent.message}
          option={popUpContent.option}
        />
      </Container>

      <Footer />
    </>
  );
}

export default Registration;
