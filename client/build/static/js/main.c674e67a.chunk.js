(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{72:function(e,t,n){},74:function(e,t,n){},75:function(e,t,n){},76:function(e,t,n){},77:function(e,t,n){},78:function(e,t,n){},79:function(e,t,n){"use strict";n.r(t);var a=n(1),c=n.n(a),r=n(35),s=n.n(r),i=n(2),o=n(36),l=n.n(o),u=(n(72),n(0));var d=function(e){var t=e.setAppView,n=e.socket,c=e.setLobby,r=Object(a.useState)(""),s=Object(i.a)(r,2),o=s[0],l=s[1];return Object(a.useEffect)((function(){function e(e){var n=JSON.parse(e);if(c(n),n.inGame)t("game");else{var a=new URL(window.location);a.searchParams.set("id",n.id),window.history.replaceState({},"",a),t("lobby")}}return n.on("join",e),function(){return n.off("join",e)}}),[t,n,c]),Object(u.jsxs)("div",{className:"Home",children:[Object(u.jsx)("h1",{children:"Home"}),Object(u.jsxs)("form",{onSubmit:function(e){e.preventDefault();var t=new URLSearchParams(window.location.search).get("id"),a={nickname:o,lobbyId:t};n.emit("join",a)},children:[Object(u.jsx)("input",{type:"text",placeholder:"Nickname",value:o,onChange:function(e){return l(e.target.value)},required:!0}),Object(u.jsx)("button",{children:"Join Lobby"})]})]})};var b=function(e){var t=e.socket,n=e.lobby,c=e.setLobby,r=e.isAdmin;function s(e){var t=JSON.parse(JSON.stringify(n));t.rounds=e,c(t)}function i(e){var t=JSON.parse(JSON.stringify(n));t.time=e,c(t)}function o(e){var t=JSON.parse(JSON.stringify(n));t.words=e,c(t)}return Object(a.useEffect)((function(){function e(e){s(e)}function n(e){i(e)}function a(e){o(e)}return t.on("roundsChanged",e),t.on("timeChanged",n),t.on("wordsChanged",a),function(){t.off("roundsChanged",e),t.off("timeChanged",n),t.off("wordsChanged",a)}}),[t,n]),Object(u.jsxs)("div",{className:"LobbyOptions",children:[Object(u.jsx)("label",{htmlFor:"rounds",children:"Rounds"}),Object(u.jsxs)("select",{className:"rounds",name:"rounds",disabled:!r(),value:n.rounds,onChange:function(e){if(r()){var n=e.target.value;s(n),t.emit("roundsChanged",n)}},children:[Object(u.jsx)("option",{value:"1",children:"1"}),Object(u.jsx)("option",{value:"2",children:"2"}),Object(u.jsx)("option",{value:"3",children:"3"}),Object(u.jsx)("option",{value:"4",children:"4"}),Object(u.jsx)("option",{value:"5",defaultValue:!0,children:"5"}),Object(u.jsx)("option",{value:"6",children:"6"}),Object(u.jsx)("option",{value:"7",children:"7"}),Object(u.jsx)("option",{value:"8",children:"8"}),Object(u.jsx)("option",{value:"9",children:"9"}),Object(u.jsx)("option",{value:"10",children:"10"})]}),Object(u.jsx)("label",{htmlFor:"time",children:"Drawing time (seconds)"}),Object(u.jsxs)("select",{className:"time",name:"time",disabled:!r(),value:n.time,onChange:function(e){if(r()){var n=e.target.value;i(n),t.emit("timeChanged",n)}},children:[Object(u.jsx)("option",{value:"10",children:"10"}),Object(u.jsx)("option",{value:"20",children:"20"}),Object(u.jsx)("option",{value:"30",children:"30"}),Object(u.jsx)("option",{value:"40",children:"40"}),Object(u.jsx)("option",{value:"50",children:"50"}),Object(u.jsx)("option",{value:"60",children:"60"}),Object(u.jsx)("option",{value:"70",children:"70"}),Object(u.jsx)("option",{value:"80",children:"80"}),Object(u.jsx)("option",{value:"90",defaultValue:!0,children:"90"}),Object(u.jsx)("option",{value:"100",children:"100"}),Object(u.jsx)("option",{value:"110",children:"110"}),Object(u.jsx)("option",{value:"120",children:"120"}),Object(u.jsx)("option",{value:"130",children:"130"}),Object(u.jsx)("option",{value:"140",children:"140"}),Object(u.jsx)("option",{value:"150",children:"150"}),Object(u.jsx)("option",{value:"160",children:"160"}),Object(u.jsx)("option",{value:"170",children:"170"}),Object(u.jsx)("option",{value:"180",children:"180"})]}),Object(u.jsx)("label",{htmlFor:"words",children:"Words"}),Object(u.jsx)("textarea",{className:"words",value:n.words.join(","),onChange:function(e){if(r()){var n=e.target.value.split(",");o(n),t.emit("wordsChanged",n)}},disabled:!r()})]})};n(74);var j=function(e){var t=e.setAppView,n=e.socket,c=e.lobby,r=e.setLobby,s=e.isAdmin;return Object(a.useEffect)((function(){return n.on("joinGame",(function(){t("game"),n.emit("ready")})),function(){return n.off("joinGame")}}),[n,t]),Object(u.jsxs)("div",{className:"Lobby",children:[Object(u.jsx)("h1",{children:"Lobby"}),Object(u.jsxs)("strong",{children:[window.location.protocol,"//",window.location.host,"/?id=",c.id]}),Object(u.jsxs)("div",{className:"options-players",children:[Object(u.jsx)(b,{socket:n,lobby:c,setLobby:r,isAdmin:s}),Object(u.jsxs)("div",{className:"players",children:[Object(u.jsx)("label",{htmlFor:"player-list",children:"Players"}),Object(u.jsx)("div",{className:"player-list",children:c.players.map((function(e,t){return Object(u.jsx)("p",{children:e.nickname},t)}))})]})]}),Object(u.jsx)("button",{onClick:function(){n.emit("joinGame"),t("game"),n.emit("ready")},disabled:!s(),children:"Start"})]})};var f=function(e){var t=e.lobby,n=e.index,c=Object(a.useState)(t.players[n]),r=Object(i.a)(c,2),s=r[0],o=r[1];return Object(a.useEffect)((function(){o(t.players[n])}),[t,o]),Object(u.jsxs)("div",{className:"Player",style:{backgroundColor:s.onTurn?"#6ed1ff":s.guessed?"#6eff8b":"gray"},children:[Object(u.jsx)("p",{className:"nickname",children:s.nickname}),Object(u.jsx)("p",{className:"points",children:s.points})]})},O=n(17);n(75);var h=function(e){var t=e.socket,n=e.lobby,c=e.setLobby,r=Object(a.useState)([]),s=Object(i.a)(r,2),o=s[0],l=s[1];return Object(a.useEffect)((function(){function e(e){l([].concat(Object(O.a)(o),[e]))}function a(e){var t=JSON.parse(JSON.stringify(n)),a=t.players.findIndex((function(t){return t.id===e[0]}));t.players[a].guessed=!0,t.players[a].points+=e[1],t.players[a].pointsThisTurn=e[1],c(t),l([].concat(Object(O.a)(o),[{sender:"Player "+n.players[a].nickname,value:"guessed the word!"}]))}return t.on("messageSent",e),t.on("playerGuessed",a),function(){t.off("messageSent",e),t.off("playerGuessed",a)}}),[t,n,c,o]),Object(u.jsxs)("div",{className:"Chat",children:[Object(u.jsx)("div",{className:"messages",children:o.map((function(e,t){return Object(u.jsxs)("p",{className:"message",children:[e.sender,": ",e.value]},t)}))}),Object(u.jsx)("input",{type:"text",onKeyDown:function(e){if("Enter"===e.key){var a={sender:n.players.find((function(e){return e.id===t.id})).nickname,value:e.target.value};e.target.value="",l([].concat(Object(O.a)(o),[a])),function(e){t.emit("messageSent",e)}(a)}}})]})};n(76);var p=function(e){var t=e.socket,n=e.isOnTurn,a=e.canvasRef,c=e.contextRef,r=e.drawColor,s=e.setDrawColor,i=e.setDrawMode,o=e.setDrawWidth;return Object(u.jsxs)("div",{className:"DrawingOptions",children:[Object(u.jsx)("div",{className:"current-color",style:{backgroundColor:n()?r:"#000000"}}),Object(u.jsx)("div",{className:"colors",children:["#ffffff","#000000","#b9b9b9","#7d8180","#e0222c","#92000d","#f98a21","#f4620b","#ffd011","#f5bb00","#63ba2d","#267637","#78cdf2","#009ada","#0060b4","#022c78","#8b159f","#5b1577","#df177a","#ab1b7a","#ba5901","#763100"].map((function(e,a){return Object(u.jsx)("button",{style:{backgroundColor:e},onClick:function(){return function(e){n()&&(s(e),t.emit("colorChanged",e))}(e)},disabled:!n()},a)}))}),Object(u.jsxs)("div",{className:"drawing-modes",onChange:function(e){n()&&i(e.target.value)},children:[Object(u.jsxs)("label",{children:[Object(u.jsx)("input",{type:"radio",name:"mode",value:"brush",defaultChecked:!0,disabled:!n()}),Object(u.jsx)("img",{src:"images/brush.png"})]}),Object(u.jsxs)("label",{children:[Object(u.jsx)("input",{type:"radio",name:"mode",value:"line",disabled:!n()}),Object(u.jsx)("img",{src:"images/line.png"})]})]}),Object(u.jsx)("div",{className:"brush-size",onChange:function(e){n()&&(o(e.target.value),t.emit("widthChanged",e.target.value))},children:[3,10,25,40].map((function(e,t){return Object(u.jsxs)("label",{children:[Object(u.jsx)("input",{type:"radio",name:"width",value:e,defaultChecked:1==t,disabled:!n()},t),Object(u.jsx)("img",{src:"images/size"+(t+1).toString()+".png"})]})}))}),Object(u.jsx)("div",{className:"clear-canvas",children:Object(u.jsx)("button",{style:{background:"images/eraser.webg"},onClick:function(){n()&&(c.current.clearRect(0,0,a.current.width,a.current.height),t.emit("clearCanvas"))},disabled:!n()})})]})};n(77);var m=function(e){var t=e.setAppView,n=e.socket,c=e.lobby,r=e.setLobby,s=e.isAdmin,o=e.isOnTurn,l=Object(a.useState)(""),d=Object(i.a)(l,2),b=d[0],j=d[1],O=Object(a.useState)(" active"),m=Object(i.a)(O,2),v=m[0],x=m[1],y=Object(a.useState)(c.time),g=Object(i.a)(y,2),w=g[0],N=g[1],C=Object(a.useState)(""),S=Object(i.a)(C,2),k=S[0],D=S[1],T=Object(a.useState)(0),J=Object(i.a)(T,2),L=J[0],A=J[1],R=Object(a.useState)("#000000"),I=Object(i.a)(R,2),E=I[0],G=I[1],W=Object(a.useState)("brush"),P=Object(i.a)(W,2),U=P[0],V=P[1],M=Object(a.useState)(15),q=Object(i.a)(M,2),B=q[0],F=q[1],z=Object(a.useRef)(null),H=Object(a.useRef)(null),X=Object(a.useRef)(-1);function Y(e){var t=z.current.getBoundingClientRect(),n=getComputedStyle(z.current).borderLeftWidth,a=getComputedStyle(z.current).borderTopWidth;return{x:e.clientX-t.left-n.substring(0,n.length-2),y:e.clientY-t.top-a.substring(0,a.length-2)}}function K(e){H.current.beginPath(),H.current.moveTo(e.x,e.y)}function Q(e){H.current.lineTo(e.x,e.y),H.current.stroke()}return Object(a.useEffect)((function(){n.emit("turnDataRequested",n.id),setInterval((function(){X.current>=0&&(N(X.current),X.current--)}),1e3)}),[]),Object(a.useEffect)((function(){var e=z.current.getContext("2d");function a(e){G(e)}function i(e){F(e)}function o(){e.clearRect(0,0,z.current.width,z.current.height)}function l(t){if(s()){var a=e.getImageData(0,0,800,300).data.buffer,c=e.getImageData(0,300,800,300).data.buffer,r=[new Uint8ClampedArray(a),new Uint8ClampedArray(c)],i={socketId:t,timeCounter:X.current,pictureData:r};n.emit("turnDataSent",i)}}function d(t){-1!=t.timeCounter&&N(t.timeCounter-1),X.current=t.timeCounter-1;var n=new Uint8ClampedArray(t.pictureData[0]),a=new Uint8ClampedArray(t.pictureData[1]),c=new ImageData(n,800,300),r=new ImageData(a,800,300);e.putImageData(c,0,0),e.putImageData(r,0,300)}function b(e){var t=JSON.parse(JSON.stringify(c));t.players.forEach((function(e){e.onTurn=!1,e.guessed=!1,e.pointsThisTurn=0})),t.players[e[0]].onTurn=!0,r(t),D(e[1]),e[0]==c.players.findIndex((function(e){return e.id===n.id}))?j(Object(u.jsxs)("p",{children:["YOU WILL BE DRAWING",Object(u.jsx)("br",{}),e[1]]})):j(Object(u.jsxs)("p",{children:["NEXT WILL BE DRAWING",Object(u.jsx)("br",{}),c.players[e[0]].nickname]})),X.current=-1,N(c.time),0==e[0]&&A(L+1),o()}function f(){x(""),X.current=c.time}function O(e){j(Object(u.jsxs)("div",{children:[Object(u.jsxs)("p",{children:["The word was ",Object(u.jsx)("b",{children:e})]}),c.players.map((function(e,t){return Object(u.jsxs)("p",{children:[e.nickname,": ",e.pointsThisTurn]},t)}))]})),x(" active")}function h(){j(Object(u.jsxs)("div",{className:"leaderboard",children:[Object(u.jsx)("b",{children:"Game ended"}),Object(u.jsxs)("p",{className:"first-place",children:[c.players[0].nickname,": ",c.players[0].points]}),c.players.length>=2&&Object(u.jsxs)("p",{className:"second-place",children:[c.players[1].nickname,": ",c.players[1].points]}),c.players.length>=3&&Object(u.jsxs)("p",{className:"third-place",children:[c.players[2].nickname,": ",c.players[2].points]})]})),x(" active")}function p(){var e=JSON.parse(JSON.stringify(c));e.players.forEach((function(e){e.points=0})),r(e),t("lobby")}return e.lineCap="round",e.lineJoin="round",e.strokeStyle=E,e.lineWidth=B,e.beginPath(),H.current=e,n.on("startDrawing",K),n.on("draw",Q),n.on("colorChanged",a),n.on("widthChanged",i),n.on("clearCanvas",o),n.on("turnDataRequested",l),n.on("turnDataSent",d),n.on("newPlayerOnTurn",b),n.on("startTurn",f),n.on("endTurn",O),n.on("endGame",h),n.on("restartGame",p),function(){n.off("startDrawing",K),n.off("draw",Q),n.off("colorChanged",a),n.off("widthChanged",i),n.off("clearCanvas",o),n.off("turnDataRequested",l),n.off("turnDataSent",d),n.off("newPlayerOnTurn",b),n.off("startTurn",f),n.off("endTurn",O),n.off("endGame",h),n.off("restartGame",p)}}),[n,c,r,s,w,N,E,U,B]),Object(u.jsxs)("div",{className:"Game",children:[Object(u.jsx)("h1",{children:"Game"}),Object(u.jsxs)("div",{className:"info",children:[Object(u.jsx)("div",{className:"time",children:Object(u.jsxs)("p",{children:["Time: ",w]})}),Object(u.jsx)("div",{className:"word",children:Object(u.jsx)("p",{children:k})}),Object(u.jsx)("div",{className:"rounds",children:Object(u.jsxs)("p",{children:["Round: ",L,"/",c.rounds]})})]}),Object(u.jsxs)("div",{className:"players-game-chat",children:[Object(u.jsx)("div",{className:"player-list",children:c.players.map((function(e,t){return Object(u.jsx)(f,{lobby:c,index:t},t)}))}),Object(u.jsxs)("div",{className:"canvas",children:[Object(u.jsx)("div",{className:"overlay"+v,children:b}),Object(u.jsx)("canvas",{width:"800",height:"600",ref:z,onMouseDown:function(e){if(1===e.buttons&&o()){var t=Y(e);"brush"===U?(K(t),Q(t),n.emit("startDrawing",t),n.emit("draw",t)):"line"===U&&(K(t),n.emit("startDrawing",t))}},onMouseUp:function(e){if(0===e.button&&o()){var t=Y(e);"line"===U&&(Q(t),n.emit("draw",t))}},onMouseMove:function(e){if(1===e.buttons&&o()){var t=Y(e);"brush"===U&&(Q(t),n.emit("draw",t))}}})]}),Object(u.jsx)(h,{socket:n,lobby:c,setLobby:r})]}),Object(u.jsx)(p,{socket:n,isOnTurn:o,canvasRef:z,contextRef:H,drawColor:E,setDrawColor:G,setDrawMode:V,setDrawWidth:F})]})};n(78);var v=function(){var e=Object(a.useState)("home"),t=Object(i.a)(e,2),n=t[0],c=t[1],r=Object(a.useState)(),s=Object(i.a)(r,2),o=s[0],b=s[1],f=Object(a.useState)(),O=Object(i.a)(f,2),h=O[0],p=O[1];function v(){return o.id===h.players[0].id}return Object(a.useEffect)((function(){var e=l()();return b(e),function(){e.close()}}),[b]),Object(a.useEffect)((function(){function e(e){var t=JSON.parse(JSON.stringify(h));t.players.push(e),p(t)}function t(e){var t=JSON.parse(JSON.stringify(h)),n=t.players.findIndex((function(t){return t.id===e}));t.players.splice(n,1),p(t)}return o&&(o.on("playerJoined",e),o.on("playerDisconnected",t)),function(){o&&(o.off("playerJoined",e),o.off("playerDisconnected",t))}}),[o,h,p]),Object(u.jsxs)("div",{className:"App",children:["home"===n&&o&&Object(u.jsx)(d,{setAppView:c,socket:o,setLobby:p}),"lobby"===n&&h&&Object(u.jsx)(j,{setAppView:c,socket:o,lobby:h,setLobby:p,isAdmin:v}),"game"===n&&Object(u.jsx)(m,{setAppView:c,socket:o,lobby:h,setLobby:p,isAdmin:v,isOnTurn:function(){return h.players.find((function(e){return o.id===e.id})).onTurn}})]})};s.a.render(Object(u.jsx)(c.a.StrictMode,{children:Object(u.jsx)(v,{})}),document.getElementById("root"))}},[[79,1,2]]]);
//# sourceMappingURL=main.c674e67a.chunk.js.map