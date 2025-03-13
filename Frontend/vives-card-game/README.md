# vives-card-game

### Before you can start, run the following commands in your terminal:

```bash
npm install -g @vue/cli
npm install --save-dev @vue/cli-service
npm install axios
npm install cors

```
go to the "Frontend\vives-card-game" folder locally, it should look like:

C:\Users\user\....\PX3-Campus-Games\Frontend\vives-card-game

then run the following command and surf to the port it hosts on:
```bash
npm run serve
```

## make sure you are running vue 3.5.13


### Fix vulnerabilities
```
npm audit fix
```
or to force it:
```
npm audit fix --force
```


### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Login with JWT_Token
To be able to login, you have to generate a secret JWT key and put it into your .env file.

To do this, just put the following code snippet in a temporary JavaScript file.

```
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
```


To run the code snippet, open a new terminal window and navigate to the folder you placed the JavaScript file in. Now run the following command to execute the code (replace 'fileName' with your actual file name):

```
node fileName.js
```

Now you will get a long hexadecimal string, this is the JWT token. Copy this code and paste in your .env file like this (once again, replace 'yourToken' with the token you just copied):

```
JWT_SECRET=yourToken
```
