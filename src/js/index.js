/**
 * Todo 메뉴추가
 * -에스프레서 메뉴에 확인버튼을 누르면 또는 엔터를 누를시 메뉴를 추가한다
 *  메뉴가 추가되면 입력창은초기화 한다
 *  만약 사용자 입력값이 문자이외이면 추가하지 않고 경고를 한다
 *  만약 사용자 입력값이 빈값이라면 추가되지 않는다.
 *
 *
 *
 *
 * Todo 메뉴 수정
 *
 *
 * Todo 로컬 스토리지에 데이터를 저장하게 한다
 * -로컬스토리지에 데이터를 저장한다.
 * -로컬스토리지에 있는 데이터를 읽어온다.
 *
 *
 *
 * 상태- 변할수있는 데이터
 * :메뉴명
 *
 *
 * [] 웹서버를 띄운다
 * [] 서버에 새로운 메뉴가 추가 될수있게 요청한다
 * [] 카데고리별 메뉴리스트를 불러온다.
 * [] 서버에 메뉴가 수정될수 있게 요청한다.
 * []
 */

//import { json } from "stream/consumers";
import { $, $a } from "./utils/dom.js";

const menuKey = "esepressoMenu";

const store = {
  setLocalstorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },

  getLocalstorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
  removeLocalstorage(menu) {
    localStorage.removeItem();
  },
};

const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },

  async updateMenu(category, name, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다");
    }
    //return response.json();
  },

  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다");
    }
    return response.json();
  },
};

//fetch(BASE_URL, post);

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.crruntCategory = "espresso";
  let MenuList = $("#menu-list");
  const MenuName = "#menu-name";

  let removeInput = (input) => {
    $(input).value = "";
  };

  function checkInput(str) {
    if (str === "") {
      alert("문자열을 입력해주세요");
      return false;
    }
    return true;
  }

  const updateCount = () => {
    let menuCounter = this.menu[this.crruntCategory].length;
    $(".menu-count").innerText = `총 ${menuCounter}개`;
  };

  const updatedMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴수정을 해주세요", $menuName.innerText);
    console.log(this.menu[this.crruntCategory]);
    await MenuApi.updateMenu(this.crruntCategory, updatedMenuName, menuId);

    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("메뉴를 지우시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.crruntCategory].splice(menuId, 1);
      store.setLocalstorage(this.menu);
      updateCount();
      render();
    }
  };
  const soldOut = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.crruntCategory, menuId);
    console.log("sold test");
    this.menu[this.crruntCategory] = await MenuApi.getAllMenuByCategory(
      this.crruntCategory
    );
    render();
  };

  this.init = async () => {
    initEventListenter();
    this.menu[this.crruntCategory] = await MenuApi.getAllMenuByCategory(
      this.crruntCategory
    );
    render();
    updateCount();
  };

  const render = () => {
    const template = this.menu[this.crruntCategory]
      .map((item, index) => {
        return `<li data-menu-id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""}">${
          item.name
        }</span>
    <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
  >
    품절
  </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
      수정
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
    >
      삭제
    </button>
  </li>
    `;
      })
      .join("");
    MenuList.innerHTML = template;
  };

  const addMenuName = async (input) => {
    let menuName = $(input).value.trim();
    let chk = checkInput(menuName);
    if (chk) {
      this.menu[this.crruntCategory].push({ name: menuName.trim() });
      await fetch(`${BASE_URL}/category/${this.crruntCategory}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: menuName }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });

      await fetch(`${BASE_URL}/category/${this.crruntCategory}/menu`)
        .then((respons) => {
          return respons.json();
        })
        .then((data) => {
          this.menu[this.crruntCategory] = data;
          render();
        });

      removeInput(input);
      updateCount();
    }
  };

  const initEventListenter = () => {
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });
    //메뉴이동
    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.crruntCategory = categoryName;
        console.log($("#category-title"));
        $("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
        render();
        updateCount();
      }
    });

    //각 메뉴 버튼 이벤트 관리
    MenuList.addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updatedMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOut(e);
        return;
      }
    });

    //remove 함수
    MenuList.addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-remove-button")) {
      }
    });

    //엔터 입력
    $(MenuName).addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName(MenuName.trim(), MenuList);
    });

    //클릭 입력
    $("#menu-submit-button").addEventListener("click", (e) => {
      addMenuName(MenuName, MenuList);
    });
  };
  //메뉴변경
}

const app = new App();
app.init();
