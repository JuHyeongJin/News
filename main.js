// newscatcher api key: nZlMohtufaB7zpiLzjKbF8E_IfynocouWHUnQ-_2y8w

let searchButton = document.getElementById("search-button");
let news = [];
let page = 1;
let total_pages = 0;
let url = "";
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

//API를 이용해 데이터 가져와 뿌려주기
const getNews = async () => {
  try {
    //헤더준비
    let header = new Headers({
      "x-api-key": "nZlMohtufaB7zpiLzjKbF8E_IfynocouWHUnQ-_2y8w",
    });
    //page 선택
    url.searchParams.set("page", page); //&page=${page}
    //url 부르기
    let response = await fetch(url, { headers: header }); //ajax, http, fetch 등 사용가능
    //데이터 가져오기
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과가 없습니다.");
      }
      //데이터 보여주기
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      render();
      pagination();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

//API로 가장 최신뉴스 가져와 뿌려주기
const getLatestNews = async () => {
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10"
  );
  getNews();
};

//API로 선택한 topic주제 기사 가져와 뿌려주기
const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

//API로 검색한 키워드 기사 가져와 뿌려주기
const getNewsByKeyword = async () => {
  //검색 키워드 읽어오기
  let keyword = document.getElementById("search-input").value;
  //url에 검색 키워드 붙이기
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

//화면에 각각의 기사 뿌려주기
const render = () => {
  let newsHTML = "";

  newsHTML = news
    .map((item) => {
      return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}" alt="">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.summary}
            </p>
            <div>
                ${item.rights} * ${item.published_date}
            </div>
        </div>
    </div>`;
    })
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};

//오류발생시 원하는 에러메시지 출력
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

//화면 하단의 페이지네이션 구성
const pagination = () => {
  let paginationHTML = "";
  //알아야할 것: 전체 페이지 수, 현재 페이지, 페이지 그룹, 시작과 끝 페이지
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  
  if (last > total_pages) {
    //마지막 그룹이 5개 이하라면
    last = total_pages;
  }
  let first = last - 4 <= 0 ? 1 : last - 4; //첫 그룹이 5 이하라면

  //좌측 화살표
  if (first >= 6) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  //페이지 5개씩
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="moveToPage(${i})" >${i}</a>
                       </li>`;
  }
  //우측 화살표
  if (last < total_pages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="moveToPage(${total_pages})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

//페이지네이션에 사용하는 선택된 페이지로 이동하기
const moveToPage = (pageNum) => {
  //이동하고싶은 페이지 알기
  page = pageNum;
  //그 페이지를 가지고 api 호출
  getNews();
};

//검색아이콘을 통해 검색창 on/off
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

//삼단메뉴바를 통한 토픽 열기
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

//삼단메뉴바 닫기
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();