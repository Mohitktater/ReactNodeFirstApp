// authService.js
import axios from 'axios';

export const isAuthenticated = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('token', token);

    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
     
    const response = await axios.post(`http://localhost:8081/api/auth/verification`, formDataObject, {
      headers: {
        Authorization: `${token}`
      }
    });

    console.log(response);
   

    if (response.data.type === 'success') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      return false;
    } else if (error.response && error.response.status === 403) {
      return false;
    } else {
      return false;
    }
  }
};
