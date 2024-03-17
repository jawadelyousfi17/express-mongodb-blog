const fs = require('fs')
const path = require('path')

const writeToFile = (content , fileName ) => {
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  content =  content.replace(scriptRegex, '<p>Script Detected and Removed</p>');
    const filePath = path.join(__dirname , '..' , 'views' , 'articles' , fileName )
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
    });
}

module.exports = writeToFile