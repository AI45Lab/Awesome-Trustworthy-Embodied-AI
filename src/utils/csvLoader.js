import Papa from 'papaparse';

export function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // 每一行自动转为对象
            const papers = results.data.map(row => ({
              title: row['论文标题'],
              date: row['发表年月'],
              author: row['一作'],
              authorOrg: row['一作单位'],
              contact: row['通讯'],
              contactOrg: row['通讯单位'],
              macro: row['宏观维度'],
              app: row['应用维度'],
              tasks: row['具身任务']?.split(',').map(s => s.trim()),
              methods: row['方法论']?.split(',').map(s => s.trim()),
              link: row['链接']
            }));
            resolve(papers);
          },
          error: err => reject(err)
        });
      })
      .catch(error => reject(error));
  });
}