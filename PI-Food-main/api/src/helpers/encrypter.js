const bcrypt = require('bcrypt');

const passwordEncryptor = (pass) => {
    const password = pass;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
};

const checkPassword =  (password, userPassword) => {
const checked =  bcrypt.compareSync(password, userPassword);
return checked;
};


//(async() => console.log(await passwordEncryptor('entreRios2914')))();
//(async() => console.log(await checkPassword('$2b$10$wpJGEUX44kRrwYtdFSAwnOFDNvEyL6FKgHpoVOsklG7XYduVwclKK', 'entreRios2914')))();

module.exports = {
    passwordEncryptor,
    checkPassword
};