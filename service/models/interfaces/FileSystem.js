/**
 * @abstract
 */
class FileSystem {

    writeFile(filePath, content, callback){}
    async writeFileSync(filePath, content){}
    
}

module.exports = FileSystem;


