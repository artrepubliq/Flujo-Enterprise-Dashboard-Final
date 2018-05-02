// /*Start Chat Camp window initializaion to avoid build errors*/
// declare global {
//     interface Window { cc: any; ChatCampUI: any; }
//   }
// export module ChatCamp{  

//     function chatCamp() {
//         window.cc = window.cc || {};
//         window.ChatCampUI = window.ChatCampUI || {};
//     }

//     function loadScript(url) {
//         console.log('preparing to load...')
//         let node = document.createElement('script');
//         node.src = url;
//         node.type = 'text/javascript';
//         document.getElementsByTagName('head')[0].appendChild(node);
//     }

//  loadScript('/widget-example/static/js/main.428ae54a.js');   
// }