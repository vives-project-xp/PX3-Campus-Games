function makeQRCode() {
  const tradeCode = makeid(10);
  const qrcode = new QRCode(document.getElementById('qrcode'), {
      text: tradeCode,
      width: 128,
      height: 128,
      colorDark: '#000',
      colorLight: '#fff',
      correctLevel: QRCode.CorrectLevel.H
  });

  // Send the code to the server
  fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: tradeCode, userId: 'User1' }) // Replace 'User1' with a unique user ID
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'connected') {
          console.log('Connection established with:', data.users);
      } else {
          console.log('Waiting for another user to scan the code...');
      }
  });
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
  }
  return result;
}

window.onload = makeQRCode;