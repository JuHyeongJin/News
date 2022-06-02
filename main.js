// newscatcher api key: nZlMohtufaB7zpiLzjKbF8E_IfynocouWHUnQ-_2y8w

let searchButton = document.getElementById("search-button");
let news = [];
let url = "";
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

const getNews = async () => {
  //헤더준비
  let header = new Headers({
    "x-api-key": "nZlMohtufaB7zpiLzjKbF8E_IfynocouWHUnQ-_2y8w",
  });
  //url 부르기
  let response = await fetch(url, { headers: header }); //ajax, http, fetch 등 사용가능
  //데이터 가져오기
  let data = await response.json();
  //데이터 보여주기
  news = data.articles;
  render();
};

const getLatestNews = async () => {
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=sport&page_size=5"
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

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
