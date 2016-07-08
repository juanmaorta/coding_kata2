export interface StorageInterface {
  rootDir: DirectoryInterface;
  rootDirectory(): DirectoryInterface;
  totalSize(): number;
  totalMp3(): number;
}

export interface DirectoryInterface {
  addFile(file: iStorable);
  deleteFile(file: iStorable);
  getAllFiles(): Array<iStorable>;
}

export interface iStorable {
  name(): string;
  size(): number;
}


// -------------------------------------------

class Storage implements StorageInterface {
  rootDir: DirectoryInterface;

  construct(){
    this.rootDir = new Directory('root');
  }

  rootDirectory() {
    return this.rootDir;
  }

  totalMp3() {
    //return this.rootDir.sizeByType('mp3');
    return 0;
  }

  totalSize() {
    return 10;
  }
}

class Directory implements DirectoryInterface, iStorable {
  _name: string;
  _files: Array<iStorable>;

  constructor(name: string) {
    this._name = name;
    this._files = [];
  }

  addFile(file: iStorable) {
    this._files.push(file);
  }

  getAllFiles() {
    return this._files;
  }

  deleteFile(file: iStorable) {
    this._files = this._files.filter((_file) => {
      return _file.name !== file.name;
    });
  }

  name() {
    return this._name;
  }

  size() {
    return this._files.reduce((carry: number, file: iStorable) => {
      return carry + file.size();
    }, 0);
  }

  filterByType(fileType) {
    return this._files
      .filter((file: any) => {
        if (file instanceof Directory) {
          return file.filterByType(fileType);
        }
        // @todo call deeper directory
        // return file.isOfType(fileType);
      });
    }

  sizeByType(fileType) {
    return this
      .filterByType(fileType)
      .reduce((carry, file: iStorable) => {
        return carry + file.size();
      });
  }
}

class Zip extends Directory
{
  _name: string;
  _size: number;

  constructor(name, size: number) {
    super(name);
    this._size = size;
  }

  size() {
    return this._size;
  }
}

class File implements iStorable {
  _name: string;
  _size: number;

  constructor(name, size) {
    this._name = name;
    this._size = size;
  }

  name() {
    return this._name;
  }

  size() {
    return this._size;
  }

  isOfType(fileType) {
    let re = new RegExp('/^(.*)\.' + fileType + '$/');

    return re.test(this._name);
  }
}
