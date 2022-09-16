const fs = require('fs/promises');
const http = require('https')
const axios = require('axios');

const userService = {
  async getUserByHash(hash) {
    // const users = await fs.readFile(`${__dirname}/data.json`, 'utf8');
    // const user = JSON.parse(users)[hash];
    const response = await axios.get(`https://cooldogs.io/api/poker/user?key=${process.env.DOG_KEY}&hash=${hash}`);
    const user = response.data;
    if (user) return {
      ...user,
      hash
    };
    return null;
  },

  async userLeaveRoom(hash, bones) {
    // const fileData = await fs.readFile(`${__dirname}/data.json`, 'utf8');

    // const users = JSON.parse(fileData);
    // users[hash].bones = bones

    // const newFileData = await fs.writeFile(`${__dirname}/data.json`, JSON.stringify(users), 'utf8');

    const response = await axios.get(`https://cooldogs.io/api/poker/user-leave-room?key=${process.env.DOG_KEY}&hash=${hash}&bones=${bones}`);

    return true;
  }
};

module.exports = userService;