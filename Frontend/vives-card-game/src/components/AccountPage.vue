<template>
    <div>
      <h2>Log in</h2>
      <p>Heb je al een account? Log je dan hier in met je gegevens.</p>
      <p>(login)</p>
      <h2>Registreer</h2>
      <p>Heb je nog geen account? Registreer je dan hier.</p>
      <p>(registratie)</p>
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