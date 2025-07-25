const BASE_URL = "http://localhost:8000";

window.onload = async () => {
  await loadData();
};

const loadData = async () => {
  console.log("on load");
  // 1.Load user ทั้งหมดออกมาจาก API
  const response = await axios.get(`${BASE_URL}/users`);

  console.log(response.data);

  const userDOM = document.getElementById("user");

  // 2.นำ user ที่โหลดมาใส่กลับเข้าไปใน html
  let htmlData = "<div>";
  for (let i = 0; i < response.data.length; i++) {
    let user = response.data[i];
    htmlData += `<div style="width: 100%; border: 1px solid black; border-radius: 20px; padding: 10px; margin: 10px; display: flex; flex-direction: column; align-items: center;">
        <div><p><b>(${user.id})</b> ${user.firstname} ${user.lastname}</p></div>
        <a href="index.html?id=${user.id}"><button class="button" style="width:150px; height:5%; padding: 10px; margin-top:10px; background-color: green;">Edit</button></a>
        <button class="delete button" style="width:150px; height:5%; padding: 10px; margin-top:10px; background-color: red;" data-id="${user.id}">Delete</button>
    </div>`;
  }
  htmlData += "</div>";

  userDOM.innerHTML = htmlData;

  // button class="delete" ได้ถือกำเนิดขึ้นมาแล้ว
  const deleteDOMs = document.getElementsByClassName("delete");
  for (let i = 0; i < deleteDOMs.length; i++) {
    deleteDOMs[i].addEventListener("click", async (event) => {
      // ดึง id ออกมา
      const id = event.target.dataset.id;
      try {
        await axios.delete(`${BASE_URL}/users/${id}`);
        loadData(); // recursive function = การเรียก function ตัวเองซ้ำอีกรอบ
      } catch (error) {
        console.log("error", error);
      }
    });
  }
};
