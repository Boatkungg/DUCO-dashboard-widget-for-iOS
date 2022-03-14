const USERNAME = 'your username'; // <-- Your username here

const EXCHANGE_PAIR_PRICE = 'price'; // for real(normal) price use 'price'. for other coin price use 'price COIN_NAME' e.g. 'price XRP'. for exchange price use 'EXCHANGER price' e.g. 'Node-S price'.   p.s. case sensitive

const refreshRate = 10; // time in second

// p.s. it will update but i don't know when
 
    
async function getUserJson(username) {  
  const loadedJson = await new Request('https://server.duinocoin.com/users/' + username).loadJSON();
 
  if (loadedJson.result !== undefined) {
    if (loadedJson['result']['transactions'].length != 0) {
      let result = {
      'username': loadedJson['result']['balance']['username'],
      'balance': loadedJson['result']['balance']['balance'],
      'miners': loadedJson['result']['miners'].length,
      'lasttransactionamount': loadedJson['result']['transactions'][loadedJson['result']['transactions'].length - 1]['amount'], 
      'lasttransactionrecipient': loadedJson['result']['transactions'][loadedJson['result']['transactions'].length - 1]['recipient'],  
      'lasttransactionsender': loadedJson['result']['transactions'][loadedJson['result']['transactions'].length - 1]['sender']
      };
      return result;
    }else{
      let result = {
      'username': loadedJson['result']['balance']['username'],
      'balance': loadedJson['result']['balance']['balance'],
      'miners': loadedJson['result']['miners'].length,
      'lasttransactionamount': 'none', 
      'lasttransactionrecipient': 'none',  
      'lasttransactionsender': 'none'
      };
      return result;
    }
  }else{  
    return null;
  }
}

async function getServerJson(exchange) {
  const loadedJson = await new Request('https://server.duinocoin.com/api.json').loadJSON();
  
  if (loadedJson.result === undefined) {
    let result = {
      'price': loadedJson['Duco ' + exchange]
    };
    return result;
  }else{
    console.log('WTF');
    return null;
  }
}

async function createWidget(USERNAME, EXCHANGE_PAIR_PRICE, refreshRate) {      
  let dashbroadJson = await getUserJson(USERNAME);
  let dashbroadJson2 = await getServerJson(EXCHANGE_PAIR_PRICE);
  let nextupdate = Date.now() + 1000 * refreshRate;
  
  let colorBackground = Color.black();  // <-- change color here
  let colorFont = Color.white();  // <-------'
  
  const dashbroadWidget = new ListWidget();      
  dashbroadWidget.backgroundColor = colorBackground;
  dashbroadWidget.refreshAfterDate = new Date(nextupdate); // from https://talk.automators.fm/t/refresh-interval-widget/9011/3
  
  const stack = dashbroadWidget.addStack();
  stack.size = new Size(340, 0);
  stack.addSpacer(4);
  stack.layoutVertically();
  
  if(dashbroadJson == null || dashbroadJson2 == null) {
    const error = stack.addText('There was a(an) ERROR with the API or the code try again later');
    error.font = new Font('Menlo', 13);
    error.textColor = Color.red();
    
    return dashbroadWidget;
  }
  const name = stack.addText('  🤑 | Username: ' + dashbroadJson['username']);
  name.font = new Font('Menlo', 17);
  name.textColor = colorFont;
  
  const bal = stack.addText('  👛 | Balance: ~' + dashbroadJson['balance'].toFixed(3) + ' DUCO(s)');
  bal.font = new Font('Menlo', 14);
  bal.textColor = colorFont;
    
  const bal2 = stack.addText('      ~±' + (dashbroadJson['balance'] * dashbroadJson2['price']).toFixed(3) +  ' USD Rate: 1 DUCO/' + dashbroadJson2['price'] + ' USD');
  bal2.font = new Font('Menlo', 13);
  bal2.textColor = colorFont;
  
  const miner = stack.addText('  ⛏ | Miner(s): ' + dashbroadJson['miners']);
  miner.font = new Font('Menlo', 14);
  miner.textColor = colorFont;
  
  const transaction1 = stack.addText('  💸 | Last transaction:');
  transaction1.font = new Font('Menlo', 14);
  transaction1.textColor = colorFont;
  
  const transaction2 = stack.addText('      Amount: ' + dashbroadJson['lasttransactionamount'] +  ' DUCO(s)');
  transaction2.font = new Font('Menlo', 13);
  transaction2.textColor = colorFont;
  
  const transaction3 = stack.addText('      From: ' + dashbroadJson['lasttransactionsender']);
  transaction3.font = new Font('Menlo', 13);
  transaction3.textColor = colorFont;
  
  const transaction4 = stack.addText('      To: ' + dashbroadJson['lasttransactionrecipient']);
  transaction4.font = new Font('Menlo', 13);
  transaction4.textColor = colorFont;
  
  // dashbroadWidget.presentMedium();
  
  return dashbroadWidget;
}

Script.setWidget(await createWidget(USERNAME, EXCHANGE_PAIR_PRICE, refreshRate));
Script.complete();

