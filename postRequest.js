function postContent() {
  // 問題年度をランダムに選択
  var seasonList = ["01_aki", "31_haru", "30_aki",  "30_haru"];
  var season = seasonList[Math.floor(Math.random() * seasonList.length)];

  // 乱数で問題作成
  var number = Math.ceil( Math.random() * 80);
  
  // スクレイピング
  const base = "https://www.fe-siken.com/kakomon/" + season + "/";
  const url = base + "q" + number + ".html";
  var html = UrlFetchApp.fetch(url).getContentText('Shift_JIS');
  var content = "";

  // 問題文を取得
  var itemRegexp = new RegExp(/<div>.+<\/div>/g);
  var item = html.match(itemRegexp);
  var question = item[0].replace(/.*<div>/, '').replace(/<\/div.*/, '').replace(/<.*>/g, '');
  content += question + "\n\n";
  
  const baseMobile = "https://www.fe-siken.com/s/kakomon/" + season + "/";
  const urlMobile = baseMobile + "q" + number + ".html";  
  
  content += "続き↓\n" + urlMobile;
  sendPostContent(content);
}

function sendPostContent(content) {
  var token = ['TFjRNIPG95mAFc87mpKbm1YSyZ4eE6IQ8k4Aabvxs7Q'];
  var options = {
    "method": "post",
    "payload" : {"message": content },
    "headers": {"Authorization": "Bearer " + token}    
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}

function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}

