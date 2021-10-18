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
 * 
 */
const $ = (selector)=> document.querySelector(selector);
const $a= (selector)=>document.querySelectorAll(selector);


const returnMenuItem=(name)=>{
    return `<li class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name">${name}</span>
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
    `}

let removeInput=(input)=>{
    $(input).value="";
}
function insertHtml(item,dest,func){
  dest.insertAdjacentHTML("beforeend",func(item));
}

function counter(){
}
function checkInput(str){
    if(str===""){
        alert("문자열을 입력해주세요");
        return false;
    }
    return true;
}

function addMenuName(input,toList){
    let menuName=$(input).value;
    let chk=checkInput(menuName);
    if(chk){ insertHtml(menuName,toList,returnMenuItem);
    
    let editBtn=$(".menu-edit-button"); 
    console.log(editBtn);
    removeInput(input);
    updateCount();
}
}

function updateMenuName(e){
        const $menuName=e.target.closest("li").querySelector(".menu-name");
        const updatedMenuName=prompt("메뉴수정을 해주세요",$menuName.innerText);     
        $menuName.innerText=updatedMenuName;
}

function updateCount(){
  let menuCounter=$a(".menu-list-item").length;
  $(".menu-count").innerText=`총 ${menuCounter}개`;
}


function App(){
    let menuName;
    let espMenuList=$("#espresso-menu-list");
    const epsMenuName="#espresso-menu-name";

    //수정 함수
    espMenuList.addEventListener("click",(e)=>{
      if(e.target.classList.contains("menu-edit-button"))
      {
        updateMenuName(e);
      }
      })
    espMenuList.addEventListener("click",(e)=>{
      if(e.target.classList.contains("menu-remove-button")){
        if(confirm("hi")){
          e.target.closest("li").remove();
          updateCount();

        }
      }
    })

    $("#espresso-menu-form").addEventListener("submit",(e)=>{e.preventDefault();})
    $(epsMenuName).addEventListener("keypress",(e)=>{
        if(e.key!=="Enter"){
            return;
        }
        addMenuName(epsMenuName,espMenuList);
      })
    
      $("#espresso-menu-submit-button").addEventListener("click",(e)=>{
            addMenuName(epsMenuName,espMenuList);
    })

}
App();