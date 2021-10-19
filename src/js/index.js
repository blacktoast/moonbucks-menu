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
 */
const $ = (selector) => document.querySelector(selector);
const $a = (selector) => document.querySelectorAll(selector);
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

function updateCount() {
  let menuCounter = $a(".menu-list-item").length;
  $(".menu-count").innerText = `총 ${menuCounter}개`;
}

function App() {
  this.menu = [];
  let espMenuList = $("#espresso-menu-list");
  const epsMenuName = "#espresso-menu-name";
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  this.init = () => {
    console.log(store.getLocalstorage().length);
    if (store.getLocalstorage().length > 0) {
      this.menu = store.getLocalstorage();
      console.log(this.menu);
      render();
      updateCount();
    }
  };
  const render = () => {
    const template = this.menu
      .map((item, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name">${item.name}</span>
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
    espMenuList.innerHTML = template;
  };

  const addMenuName = (input) => {
    let menuName = $(input).value.trim();
    let chk = checkInput(menuName);
    if (chk) {
      this.menu.push({ name: menuName.trim() });
      store.setLocalstorage(this.menu);
      render();
      removeInput(input);
      updateCount();
    }
  };

  //수정 함수
  espMenuList.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      const menuId = e.target.closest("li").dataset.menuId;
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedMenuName = prompt(
        "메뉴수정을 해주세요",
        $menuName.innerText
      );
      this.menu[menuId].name = updatedMenuName;
      store.setLocalstorage(this.menu);
      $menuName.innerText = updatedMenuName;
    }
  });

  //remove 함수
  espMenuList.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("메뉴를 지우시겠습니까?")) {
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu.splice(menuId, 1);
        console.log(menuId, this.menu);
        e.target.closest("li").remove();
        store.setLocalstorage(this.menu);
        updateCount();
        render();
      }
    }
  });

  //엔터 입력
  $(epsMenuName).addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName(epsMenuName.trim(), espMenuList);
  });

  //클릭 입력
  $("#espresso-menu-submit-button").addEventListener("click", (e) => {
    addMenuName(epsMenuName, espMenuList);
  });
}
const app = new App();
app.init();
