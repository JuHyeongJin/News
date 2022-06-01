// newscatcher api key: nZlMohtufaB7zpiLzjKbF8E_IfynocouWHUnQ-_2y8w

let news = [];

const getLatestNews = async()=>{
    let url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=2');
    let header = new Headers({'x-api-key':'nZlMohtufaB7zpiLzjKbF8E_IfynocouWHUnQ-_2y8w'});

    let response = await fetch(url,{headers:header}); //ajax, http, fetch 등 사용가능
    let data = await response.json();

    news = data.articles;
    console.log(news);

}

getLatestNews();