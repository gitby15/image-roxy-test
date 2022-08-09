const Koa = require('koa');
const textToImage = require('text-to-image')
const app = new Koa();



app.use(async (context) => {
    
  const now = new Date();
  
  const cookie = context.request.headers.cookie;
  const ua = context.request.headers['user-agent']
  const ip = context.request.ip;
  const ip2 = context.request.headers['X-Forwarded-For']


  const text = [
    'Now: ' + now.toUTCString(), 
    'User-Agent: ' + ua, 
    'IP: '+ ip, 
    'X-Forwarded-For: ' + ip2,
    'Cookie: ' + cookie
  ].join('\n---------------- line ----------------\n');

  const dataURI = await textToImage.generate(text, {
    fontFamily: 'Arial',
    textColor: 'red',
  });

  const dataURIForBuffer = dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  const image = Buffer.from(dataURIForBuffer, 'base64');
  context.set('Set-Cookie', `LAST_TIME=${now.toUTCString()}; path=/`)
  context.set('Content-type', 'image/png')
  context.set('Content-Length', image.length)
  context.body = image;
  

})

app.listen(80);
