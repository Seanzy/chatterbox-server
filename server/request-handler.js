/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var _ = require('underscore');
var uid = 0; 

var data = {
  results: []
};

var temp = {
  id: uid++,
  username: 'Mel Brooks',
  text: 'This is my message.',
  roomname: 'lobby'
};

data.results.push(temp);



var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};



var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages
  // if (request.method === 'GET' && request.url === '/echo') {
    
  request.on('error', (err) => {
    console.log('ERROR');
  });
    
  // GET
  if (request.method === 'GET') {
    
    if (request.url !== "/classes/messages") {
      var statusCode = 404;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end('GET');
    } else {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      console.log("DATA GET ", data.results);
      response.end(JSON.stringify(data));
    }
    
    
    // post 
  } else if( request.method === "OPTIONS" ) {
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    console.log("DATA GET ", data.results);
    response.end();
  
  } else if (request.method === 'POST') {
    
    if (request.url !== "/classes/messages") {
      
      var statusCode = 404;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end('POST');
      
    } else {
      
    // get the data that was sent with it
      var body = "";
      
      request.on('data', function (data) {
        body += data;
      });

      request.on('end', function () {
      
        var post = JSON.parse(body);
        post.id = uid++;
        console.log('POST TYPE ', post);
        data.results.push(post);

        // response
        var statusCode = 201;
        var headers = defaultCorsHeaders;
        headers['Content-Type'] = 'text/plain';
        response.writeHead(statusCode, headers);
        response.end('POST'); 
      });
    }
  }
  
  // // The outgoing status.
  // var statusCode = 200;


  // // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // // Tell the client we are sending them plain text.
  // //
  // // You will need to change this if you are sending something
  // // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // // .writeHead() writes to the request line and headers of the response,
  // // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // // Make sure to always call response.end() - Node may not send
  // // anything back to the client until you do. The string you pass to
  // // response.end() will be the body of the response - i.e. what shows
  // // up in the browser.
  // //
  // // Calling .end "flushes" the response's internal buffer, forcing
  // // node to actually send all the data over to the client.
  // response.end('Hello, World! Nick');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;

