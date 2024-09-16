import XLSX from 'xlsx';

export const createXlsx = (data, path ) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    return XLSX.writeFile(wb, path);
}
