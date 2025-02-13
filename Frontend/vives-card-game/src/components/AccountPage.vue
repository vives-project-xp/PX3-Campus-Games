<template>
    <div>
      <h2>Log in</h2>
      <p>Already have an account? Log in here</p>
      <p>(login)</p>
      <h2>Register</h2>
      <p>Don't have an account yet? You can register right here</p>
      <p>(registration)</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'account-page'
  };
  </script>

  <style scoped>
  h2, p{
    text-align: center;
  }

  h2 {
    font-size:40px;
  }

  p{
    font-size:20px;
  }
  </style>