const ds = require('fs');

class CSVHandler {
  constructor(filePath) {
    this.filePath = filePath;
  }

  citaj() {
    const data = ds.readFileSync(this.filePath, 'utf-8');
    const rows = data.trim().split('\n');
    const header = rows[0].split(',');

    const records = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');
      const record = {};
      for (let j = 0; j < header.length; j++) {
        record[header[j]] = rowData[j];
      }
      records.push(record);
    }

    return records;
  }



    pisi(records) {
      let data = '';
      if (ds.existsSync(this.filePath)) {
        data = ds.readFileSync(this.filePath, 'utf-8');
      }
    
      const rows = [];
      for (let i = 0; i < records.length; i++) {
        const rowData = Object.values(records[i]);
        rows.push(rowData.join(',') + '\n');
      }
    
      const newData = rows.join('\n');
      data += newData;
    
      ds.writeFileSync(this.filePath, data, 'utf-8');
    }
  
}

module.exports = CSVHandler;
