function postContent() {
  // 問題年度をランダムに選択
  var seasonList = ["01_aki", "31_haru", "30_aki",  "30_haru"];
  var season = seasonList[Math.floor(Math.random() * seasonList.length)];

  // 乱数で問題作成
  var number = Math.ceil( Math.random() * 80);
  
  // スクレイピング
  const base = "https://www.fe-siken.com/kakomon/" + season + "/";
  const url = base + "q" + number + ".html";
  //const url = "https://www.fe-siken.com/kakomon/30_haru/q62.html"
  var html = UrlFetchApp.fetch(url).getContentText('Shift_JIS');
  var content = "";
  //Logger.log(url)

  // モバイル版URLを作成
  const baseMobile = "https://www.fe-siken.com/s/kakomon/" + season + "/";
  const urlMobile = baseMobile + "q" + number + ".html";  
  
  // 問題文を取得
  var question = parseQuestion(html);
  content += question + "\n\n";
  
  // 選択肢を取得
  var choices = parseChoices(html);
  content += choices + "\n";
  
  // 回答を取得
  
  // 解説を取得

  
  content += "続き↓\n" + urlMobile + "\n\n";
  sendPostContent(content);
}


function parseQuestion(html) {
  var itemRegexp = new RegExp(/<div>.+<\/div>/g);
  var item = html.match(itemRegexp);
  var question = item[0].replace(/.*<div>/, '').replace(/<\/div.*/, '').replace(/<.*>/g, '');  
  
  return question;
}

function parseChoices(html) {
  var itemRegexp = new RegExp(/<ul class="selectList cf">.+<\/ul>/g);
  var choices = html.match(itemRegexp);
  //Logger.log(choices);
  
  // 回答を配列に分割
  if (choices == null) return "";
  var choicesArray = choices[0].replace(/<ul class="selectList cf">/, '').replace(/<\/ul>/, '').split("</li>");
  // 配列分処理を回す
  var text;
  var choices = "";
  for (var i = 0; i < choicesArray.length; i++) {
    text = choicesArray[i].replace(/.*<div id="select_.">/, '').replace(/<\/div.*/, '');
    if (text == "") continue;
    choices += (i + 1) + ": " + text + "\n";
  }
  //Logger.log(choices);
  
  return choices;
}

function sendPostContent(content) {
  var token = ['input_own_token'];
  var options = {
    "method": "post",
    "payload" : {"message": content },
    "headers": {"Authorization": "Bearer " + token}    
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
