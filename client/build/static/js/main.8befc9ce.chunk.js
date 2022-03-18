(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{72:function(e,t,n){},74:function(e,t,n){},75:function(e,t,n){},76:function(e,t,n){},77:function(e,t,n){},78:function(e,t,n){},79:function(e,t,n){"use strict";n.r(t);var c=n(1),a=n.n(c),r=n(35),s=n.n(r),i=n(2),o=n(36),l=n.n(o),u=(n(72),n(0));var d=function(e){var t=e.setAppView,n=e.socket,a=e.setLobby,r=Object(c.useState)(""),s=Object(i.a)(r,2),o=s[0],l=s[1];return Object(c.useEffect)((function(){function e(e){var n=JSON.parse(e);if(a(n),n.inGame)t("game");else{var c=new URL(window.location);c.searchParams.set("id",n.id),window.history.replaceState({},"",c),t("lobby")}}return n.on("join",e),function(){return n.off("join",e)}}),[t,n,a]),Object(u.jsxs)("div",{className:"Home",children:[Object(u.jsx)("h1",{children:"Home"}),Object(u.jsxs)("form",{onSubmit:function(e){e.preventDefault();var t=new URLSearchParams(window.location.search).get("id"),c={nickname:o,lobbyId:t};n.emit("join",c)},children:[Object(u.jsx)("input",{type:"text",placeholder:"Nickname",value:o,onChange:function(e){return l(e.target.value)},required:!0}),Object(u.jsx)("button",{children:"Join Lobby"})]})]})};var b=function(e){var t=e.socket,n=e.lobby,a=e.setLobby,r=e.isAdmin;function s(e){var t=JSON.parse(JSON.stringify(n));t.rounds=e,a(t)}function i(e){var t=JSON.parse(JSON.stringify(n));t.time=e,a(t)}function o(e){var t=JSON.parse(JSON.stringify(n));t.words=e,a(t)}return Object(c.useEffect)((function(){function e(e){s(e)}function n(e){i(e)}function c(e){o(e)}return t.on("roundsChanged",e),t.on("timeChanged",n),t.on("wordsChanged",c),function(){t.off("roundsChanged",e),t.off("timeChanged",n),t.off("wordsChanged",c)}}),[t,n]),Object(u.jsxs)("div",{className:"LobbyOptions",children:[Object(u.jsx)("label",{htmlFor:"rounds",children:"Rounds"}),Object(u.jsxs)("select",{className:"rounds",name:"rounds",disabled:!r(),value:n.rounds,onChange:function(e){if(r()){var n=e.target.value;s(n),t.emit("roundsChanged",n)}},children:[Object(u.jsx)("option",{value:"1",children:"1"}),Object(u.jsx)("option",{value:"2",children:"2"}),Object(u.jsx)("option",{value:"3",children:"3"}),Object(u.jsx)("option",{value:"4",children:"4"}),Object(u.jsx)("option",{value:"5",defaultValue:!0,children:"5"}),Object(u.jsx)("option",{value:"6",children:"6"}),Object(u.jsx)("option",{value:"7",children:"7"}),Object(u.jsx)("option",{value:"8",children:"8"}),Object(u.jsx)("option",{value:"9",children:"9"}),Object(u.jsx)("option",{value:"10",children:"10"})]}),Object(u.jsx)("label",{htmlFor:"time",children:"Drawing time (seconds)"}),Object(u.jsxs)("select",{className:"time",name:"time",disabled:!r(),value:n.time,onChange:function(e){if(r()){var n=e.target.value;i(n),t.emit("timeChanged",n)}},children:[Object(u.jsx)("option",{value:"10",children:"10"}),Object(u.jsx)("option",{value:"20",children:"20"}),Object(u.jsx)("option",{value:"30",children:"30"}),Object(u.jsx)("option",{value:"40",children:"40"}),Object(u.jsx)("option",{value:"50",children:"50"}),Object(u.jsx)("option",{value:"60",children:"60"}),Object(u.jsx)("option",{value:"70",children:"70"}),Object(u.jsx)("option",{value:"80",children:"80"}),Object(u.jsx)("option",{value:"90",defaultValue:!0,children:"90"}),Object(u.jsx)("option",{value:"100",children:"100"}),Object(u.jsx)("option",{value:"110",children:"110"}),Object(u.jsx)("option",{value:"120",children:"120"}),Object(u.jsx)("option",{value:"130",children:"130"}),Object(u.jsx)("option",{value:"140",children:"140"}),Object(u.jsx)("option",{value:"150",children:"150"}),Object(u.jsx)("option",{value:"160",children:"160"}),Object(u.jsx)("option",{value:"170",children:"170"}),Object(u.jsx)("option",{value:"180",children:"180"})]}),Object(u.jsx)("label",{htmlFor:"words",children:"Words"}),Object(u.jsx)("textarea",{className:"words",value:n.words.join(","),onChange:function(e){if(r()){var n=e.target.value.split(",");o(n),t.emit("wordsChanged",n)}},disabled:!r()})]})};n(74);var j=function(e){var t=e.setAppView,n=e.socket,a=e.lobby,r=e.setLobby,s=e.isAdmin;return Object(c.useEffect)((function(){return n.on("joinGame",(function(){t("game"),n.emit("ready")})),function(){return n.off("joinGame")}}),[n,t]),Object(u.jsxs)("div",{className:"Lobby",children:[Object(u.jsx)("h1",{children:"Lobby"}),Object(u.jsxs)("strong",{children:[window.location.protocol,"//",window.location.host,"/?id=",a.id]}),Object(u.jsxs)("div",{className:"options-players",children:[Object(u.jsx)(b,{socket:n,lobby:a,setLobby:r,isAdmin:s}),Object(u.jsxs)("div",{className:"players",children:[Object(u.jsx)("label",{htmlFor:"player-list",children:"Players"}),Object(u.jsx)("div",{className:"player-list",children:a.players.map((function(e,t){return Object(u.jsx)("p",{children:e.nickname},t)}))})]})]}),Object(u.jsx)("button",{onClick:function(){n.emit("joinGame"),t("game"),n.emit("ready")},disabled:!s(),children:"Start"})]})};var f=function(e){var t=e.lobby,n=e.index,a=Object(c.useState)(t.players[n]),r=Object(i.a)(a,2),s=r[0],o=r[1];return Object(c.useEffect)((function(){o(t.players[n])}),[t,o]),Object(u.jsxs)("div",{className:"Player",style:{backgroundColor:s.onTurn?"#6ed1ff":s.guessed?"#6eff8b":"gray"},children:[Object(u.jsx)("p",{className:"nickname",children:s.nickname}),Object(u.jsx)("p",{className:"points",children:s.points})]})},O=n(17);n(75);var h=function(e){var t=e.socket,n=e.lobby,a=e.setLobby,r=Object(c.useState)([]),s=Object(i.a)(r,2),o=s[0],l=s[1];return Object(c.useEffect)((function(){function e(e){l([].concat(Object(O.a)(o),[e]))}function c(e){var t=JSON.parse(JSON.stringify(n)),c=t.players.findIndex((function(t){return t.id===e[0]}));t.players[c].guessed=!0,t.players[c].points+=e[1],t.players[c].pointsThisTurn=e[1],a(t),l([].concat(Object(O.a)(o),[{sender:"Player "+n.players[c].nickname,value:"guessed the word!"}]))}return t.on("messageSent",e),t.on("playerGuessed",c),function(){t.off("messageSent",e),t.off("playerGuessed",c)}}),[t,n,a,o]),Object(u.jsxs)("div",{className:"Chat",children:[Object(u.jsx)("div",{className:"messages",children:o.map((function(e,t){return Object(u.jsxs)("p",{className:"message",children:[e.sender,": ",e.value]},t)}))}),Object(u.jsx)("input",{type:"text",onKeyDown:function(e){if("Enter"===e.key){var c={sender:n.players.find((function(e){return e.id===t.id})).nickname,value:e.target.value};e.target.value="",l([].concat(Object(O.a)(o),[c])),function(e){t.emit("messageSent",e)}(c)}}})]})};n(76);var p=function(e){var t=e.socket,n=e.isOnTurn,c=e.canvasRef,a=e.contextRef,r=e.drawColor,s=e.setDrawColor,i=e.setDrawMode,o=e.setDrawWidth;return Object(u.jsxs)("div",{className:"DrawingOptions",children:[Object(u.jsx)("div",{className:"current-color",style:{backgroundColor:n()?r:"#000000"}}),Object(u.jsx)("div",{className:"colors",children:["#ffffff","#000000","#b9b9b9","#7d8180","#e0222c","#92000d","#f98a21","#f4620b","#ffd011","#f5bb00","#63ba2d","#267637","#78cdf2","#009ada","#0060b4","#022c78","#8b159f","#5b1577","#df177a","#ab1b7a","#ba5901","#763100"].map((function(e,c){return Object(u.jsx)("button",{style:{backgroundColor:e},onClick:function(){return function(e){n()&&(s(e),t.emit("colorChanged",e))}(e)},disabled:!n()},c)}))}),Object(u.jsxs)("div",{className:"drawing-modes",onChange:function(e){n()&&i(e.target.value)},children:[Object(u.jsx)("input",{type:"radio",name:"mode",value:"brush",className:"brush",defaultChecked:!0,disabled:!n()}),Object(u.jsx)("input",{type:"radio",name:"mode",value:"line",className:"line",disabled:!n()})]}),Object(u.jsx)("div",{className:"brush-size",children:[3,10,25,40].map((function(e,c){return Object(u.jsx)("button",{onClick:function(){return function(e){n()&&(o(e),t.emit("widthChanged",e))}(e)},disabled:!n()},c)}))}),Object(u.jsx)("div",{className:"clear-canvas",children:Object(u.jsx)("button",{onClick:function(){n()&&(a.current.clearRect(0,0,c.current.width,c.current.height),t.emit("clearCanvas"))},disabled:!n()})})]})};n(77);var m=function(e){var t=e.socket,n=e.lobby,a=e.setLobby,r=e.isAdmin,s=e.isOnTurn,o=Object(c.useState)(""),l=Object(i.a)(o,2),d=l[0],b=l[1],j=Object(c.useState)(" active"),O=Object(i.a)(j,2),m=O[0],v=O[1],x=Object(c.useState)(n.time),y=Object(i.a)(x,2),g=y[0],w=y[1],N=Object(c.useState)(""),C=Object(i.a)(N,2),S=C[0],k=C[1],D=Object(c.useState)(0),T=Object(i.a)(D,2),J=T[0],L=T[1],R=Object(c.useState)("#000000"),A=Object(i.a)(R,2),I=A[0],E=A[1],G=Object(c.useState)("brush"),W=Object(i.a)(G,2),P=W[0],U=W[1],M=Object(c.useState)(15),V=Object(i.a)(M,2),q=V[0],B=V[1],F=Object(c.useRef)(null),H=Object(c.useRef)(null),X=Object(c.useRef)(-1);function Y(e){var t=F.current.getBoundingClientRect(),n=getComputedStyle(F.current).borderLeftWidth,c=getComputedStyle(F.current).borderTopWidth;return{x:e.clientX-t.left-n.substring(0,n.length-2),y:e.clientY-t.top-c.substring(0,c.length-2)}}function z(e){H.current.beginPath(),H.current.moveTo(e.x,e.y)}function K(e){H.current.lineTo(e.x,e.y),H.current.stroke()}return Object(c.useEffect)((function(){t.emit("turnDataRequested",t.id),setInterval((function(){X.current>=0&&(w(X.current),X.current--)}),1e3)}),[]),Object(c.useEffect)((function(){var e=F.current.getContext("2d");function c(e){E(e)}function s(e){B(e)}function i(){e.clearRect(0,0,F.current.width,F.current.height)}function o(n){if(r()){var c=e.getImageData(0,0,800,300).data.buffer,a=e.getImageData(0,300,800,300).data.buffer,s=[new Uint8ClampedArray(c),new Uint8ClampedArray(a)],i={socketId:n,timeCounter:X.current,pictureData:s};t.emit("turnDataSent",i)}}function l(t){-1!=t.timeCounter&&w(t.timeCounter-1),X.current=t.timeCounter-1;var n=new Uint8ClampedArray(t.pictureData[0]),c=new Uint8ClampedArray(t.pictureData[1]),a=new ImageData(n,800,300),r=new ImageData(c,800,300);e.putImageData(a,0,0),e.putImageData(r,0,300)}function d(e){var c=JSON.parse(JSON.stringify(n));c.players.forEach((function(e){e.onTurn=!1,e.guessed=!1,e.pointsThisTurn=0})),c.players[e[0]].onTurn=!0,a(c),k(e[1]),e[0]==n.players.findIndex((function(e){return e.id===t.id}))?b(Object(u.jsxs)("p",{children:["YOU WILL BE DRAWING",Object(u.jsx)("br",{}),e[1]]})):b(Object(u.jsxs)("p",{children:["NEXT WILL BE DRAWING",Object(u.jsx)("br",{}),n.players[e[0]].nickname]})),X.current=-1,w(n.time),0==e[0]&&L(J+1),i()}function j(){v(""),X.current=n.time}function f(e){b(Object(u.jsxs)("div",{children:[Object(u.jsxs)("p",{children:["The word was ",Object(u.jsx)("b",{children:e})]}),n.players.map((function(e,t){return Object(u.jsxs)("p",{children:[e.nickname,": ",e.pointsThisTurn]},t)}))]})),v(" active")}function O(){b(Object(u.jsxs)("div",{className:"leaderboard",children:[Object(u.jsx)("b",{children:"Game ended"}),Object(u.jsxs)("p",{className:"first-place",children:[n.players[0].nickname,": ",n.players[0].points]}),n.players.length>=2&&Object(u.jsxs)("p",{className:"second-place",children:[n.players[1].nickname,": ",n.players[1].points]}),n.players.length>=3&&Object(u.jsxs)("p",{className:"third-place",children:[n.players[2].nickname,": ",n.players[2].points]})]})),v(" active")}return e.lineCap="round",e.lineJoin="round",e.strokeStyle=I,e.lineWidth=q,e.beginPath(),H.current=e,t.on("startDrawing",z),t.on("draw",K),t.on("colorChanged",c),t.on("widthChanged",s),t.on("clearCanvas",i),t.on("turnDataRequested",o),t.on("turnDataSent",l),t.on("newPlayerOnTurn",d),t.on("startTurn",j),t.on("endTurn",f),t.on("endGame",O),function(){t.off("startDrawing",z),t.off("draw",K),t.off("colorChanged",c),t.off("widthChanged",s),t.off("clearCanvas",i),t.off("turnDataRequested",o),t.off("turnDataSent",l),t.off("newPlayerOnTurn",d),t.off("startTurn",j),t.off("endTurn",f),t.off("endGame",O)}}),[t,n,a,r,g,w,I,P,q]),Object(u.jsxs)("div",{className:"Game",children:[Object(u.jsx)("h1",{children:"Game"}),Object(u.jsxs)("div",{className:"info",children:[Object(u.jsx)("div",{className:"time",children:Object(u.jsxs)("p",{children:["Time: ",g]})}),Object(u.jsx)("div",{className:"word",children:Object(u.jsx)("p",{children:S})}),Object(u.jsx)("div",{className:"rounds",children:Object(u.jsxs)("p",{children:["Round: ",J,"/",n.rounds]})})]}),Object(u.jsxs)("div",{className:"players-game-chat",children:[Object(u.jsx)("div",{className:"player-list",children:n.players.map((function(e,t){return Object(u.jsx)(f,{lobby:n,index:t},t)}))}),Object(u.jsxs)("div",{className:"canvas",children:[Object(u.jsx)("div",{className:"overlay"+m,children:d}),Object(u.jsx)("canvas",{width:"800",height:"600",ref:F,onMouseDown:function(e){if(1===e.buttons&&s()){var n=Y(e);"brush"===P?(z(n),K(n),t.emit("startDrawing",n),t.emit("draw",n)):"line"===P&&(z(n),t.emit("startDrawing",n))}},onMouseUp:function(e){if(0===e.button&&s()){var n=Y(e);"line"===P&&(K(n),t.emit("draw",n))}},onMouseMove:function(e){if(1===e.buttons&&s()){var n=Y(e);"brush"===P&&(K(n),t.emit("draw",n))}}})]}),Object(u.jsx)(h,{socket:t,lobby:n,setLobby:a})]}),Object(u.jsx)(p,{socket:t,isOnTurn:s,canvasRef:F,contextRef:H,drawColor:I,setDrawColor:E,setDrawMode:U,setDrawWidth:B})]})};n(78);var v=function(){var e=Object(c.useState)("home"),t=Object(i.a)(e,2),n=t[0],a=t[1],r=Object(c.useState)(),s=Object(i.a)(r,2),o=s[0],b=s[1],f=Object(c.useState)(),O=Object(i.a)(f,2),h=O[0],p=O[1];function v(){return o.id===h.players[0].id}return Object(c.useEffect)((function(){var e=l()();return b(e),function(){e.close()}}),[b]),Object(c.useEffect)((function(){function e(e){var t=JSON.parse(JSON.stringify(h));t.players.push(e),p(t)}function t(e){var t=JSON.parse(JSON.stringify(h)),n=t.players.findIndex((function(t){return t.id===e}));t.players.splice(n,1),p(t)}return o&&(o.on("playerJoined",e),o.on("playerDisconnected",t)),function(){o&&(o.off("playerJoined",e),o.off("playerDisconnected",t))}}),[o,h,p]),Object(u.jsxs)("div",{className:"App",children:["home"===n&&o&&Object(u.jsx)(d,{setAppView:a,socket:o,setLobby:p}),"lobby"===n&&h&&Object(u.jsx)(j,{setAppView:a,socket:o,lobby:h,setLobby:p,isAdmin:v}),"game"===n&&Object(u.jsx)(m,{socket:o,lobby:h,setLobby:p,isAdmin:v,isOnTurn:function(){return h.players.find((function(e){return o.id===e.id})).onTurn}})]})};s.a.render(Object(u.jsx)(a.a.StrictMode,{children:Object(u.jsx)(v,{})}),document.getElementById("root"))}},[[79,1,2]]]);
//# sourceMappingURL=main.8befc9ce.chunk.js.map