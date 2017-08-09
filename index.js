'use strict';

const Hapi = require('hapi');
const adTag = require('adtag');

const server = new Hapi.Server();
server.connection({ port: 1338,routes:{cors:true} });

server.register(require('vision'), (err) => {

    server.views({
	    engines: {
	        html: require('handlebars')
	    },
	    path: 'views'
	});


	server.route({
	    method: 'GET',
	    path: '/load-creatives/{id}',
	    handler: function (request, reply) {
	    	adTag.refNo = request.params.id;

		console.log(request.headers.referer);

			adTag.viewMacro =  request.query.v;
	    	adTag.clickMacro =  request.query.c;
	    	adTag.lId =  request.query.lid;
	    	adTag.cId =  request.query.cid;
	    	adTag.oId =  request.query.oid;
	    	adTag.userIp = request.headers['x-forwarded-for'];
	    	adTag.requestURI = request.headers['x-forwarded-for'];
	    	
	    	adTag.deliver(reply, request);
	    }
	});

	server.route({
	    method: 'GET',
	    path: '/deliver-creatives/{id}',
	    handler: function (request, reply) {
	    	adTag.refNo = request.params.id;

		console.log(request.headers.referer);

			adTag.viewMacro =  request.query.v;
	    	adTag.clickMacro =  request.query.c;
	    	adTag.lId =  request.query.lid;
	    	adTag.cId =  request.query.cid;
	    	adTag.oId =  request.query.oid;
	    	adTag.userIp = request.headers['x-forwarded-for'];
	    	adTag.requestURI = request.headers['x-forwarded-for'];
	    	
	    	adTag.load(reply, request);
	    }
	});

	server.route({
	    method: 'GET',
	    path: '/servetag',
	    handler: function (request, reply) {
	    	reply.view('trackmetrics');
	    }
	});

});

server.register(require('inert'), (err) => {});

server.route({  
	  method: 'GET',
	  path: '/images/{file*}',
	  handler: {
	    directory: { 
	      path: 'images'
	    }
	  }
	});

server.route({  
	  method: 'GET',
	  path: '/js/{file*}',
	  handler: {
	    directory: { 
	      path: 'js'
	    }
	  }
	});
/* This is the function to create adtag */
server.route({
    method: 'POST',
    path: '/adtag',
    config: {
        payload:{
              parse: true,
          }
    },
    handler: function (request, reply) {
    	adTag.urn = request.payload.urn;
    	adTag.filePath = request.payload.filePath;
    	adTag.creativeType = request.payload.creativeType;
        reply(adTag.create());
    }
});

server.route({
    method: 'POST',
    path: '/trackview',
    config: {
        payload:{
              parse: true,
          }
    },
    handler: function (request, reply) {
    	adTag.refId = request.payload.refId;
    	adTag.lineId = request.payload.lineId;
    	adTag.creativeId = request.payload.cId;
    	adTag.orderId = request.payload.oId;
    	adTag.userIp = request.headers['x-forwarded-for'];
        reply(adTag.trackView());
    }
});

server.route({
    method: 'POST',
    path: '/trackuseractivity',
    config: {
        payload:{
              parse: true,
          }
    },
    handler: function (request, reply) {
    	adTag.refId = request.payload.refId;
    	adTag.lineId = request.payload.lineId;
    	adTag.creativeId = request.payload.cId;
    	adTag.orderId = request.payload.oId;
    	adTag.event = request.payload.event;
    	adTag.userIp = request.headers['x-forwarded-for'];
        reply(adTag.trackUserActivity());
    }
});

server.route({
    method: 'POST',
    path: '/trackvideoplayed',
    config: {
        payload:{
              parse: true,
          }
    },
    handler: function (request, reply) {
        adTag.refId = request.payload.refId;
        adTag.lineId = request.payload.lineId;
        adTag.creativeId = request.payload.cId;
        adTag.orderId = request.payload.oId;
        adTag.userIp = request.headers['x-forwarded-for'];
	adTag.duration = request.payload.dur;
        reply(adTag.trackVideoPlayed());
    }
});

server.route({
    method: 'POST',
    path: '/trackclicks',
    config: {
        payload:{
              parse: true,
          }
    },
    handler: function (request, reply) {
    	adTag.refId = request.payload.refId;
    	adTag.lineId = request.payload.lineId;
    	adTag.creativeId = request.payload.cId;
    	adTag.orderId = request.payload.oId;
    	adTag.userIp = request.headers['x-forwarded-for'];
        reply(adTag.trackClick());
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
