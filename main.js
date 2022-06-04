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

const getLatestNews = async () => {
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10"
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  //검색 키워드 읽어오기
  let keyword = document.getElementById("search-input").value;
  //url에 검색 키워드 붙이기
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

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

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagination = () => {
  let paginationHTML = "";
  //알아야할 것: 전체 페이지 수, 현재 페이지, 페이지 그룹, 시작과 끝 페이지
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;

  paginationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${page == i ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }
  paginationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`;
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  //이동하고싶은 페이지 알기
  page = pageNum;
  //그 페이지를 가지고 api 호출
  getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
