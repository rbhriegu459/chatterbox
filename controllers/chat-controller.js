const path = require('path');

const getChat =  async (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'chat.html'));
}

module.exports = {getChat};