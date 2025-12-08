import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";
const manager = new StudentManager();
manager.loadFromLocalStorage();
function renderTable(elementId = "studentTableBody") {
    const tableBody = document.getElementById(elementId);
    tableBody.innerHTML = "";
    const students = manager.getAllStudents();
    showList(students);
    students.forEach((s) => {
        tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>แก้ไขเป็น title_name</td>
        <td>แก้ไขเป็น first_name</td>
        <td>แก้ไขเป็น last_name</td>
        <td>แก้ไขเป็น email</td>
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
    });
}
document.getElementById("addBtn").onclick = () => {
    const id = document.getElementById("id").value;
    const year = Number(document.getElementById("year").value);
    const major = document.getElementById("major").value;
    //  เพิ่ม title_name,first_name,last_name, email ให้ครบ
    const student = {
        id, year, major,
        name: ""
    };
    manager.addStudent(student);
    renderTable();
};
document.getElementById("searchNameBtn").onclick = () => {
    const keyword = document.getElementById("searchName").value;
    const results = manager.findStudentsByName(keyword);
    showList(results);
    alert(`ผลการค้นหา: ${results.length} คน`);
};
document.getElementById("searchMajorBtn").onclick = () => {
    const keyword = document.getElementById("searchMajor").value;
    const results = manager.findStudentsByMajor(keyword);
    showList(results);
    alert(`พบในสาขา: ${results.length} คน`);
};
// เพิ่มค้นหาด้วย Email
renderTable("studentTableBody");
