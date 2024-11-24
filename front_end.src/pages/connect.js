
// export function getData(url) {
//         async function fetchHotSearch() {
//             // http://localhost:8001/Contacts/select
//             try {
//                 const response = await fetch(url, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Access-Control-Allow-Origin': '*',
//                         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//                         'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
//                     }
//                 });
//                 const data = await response.json();
                
//                 // 输出返回的数据以供调试
//                 console.log('API Response:', data);

//                 // 确认data字段存在且为数组
//                 if (data.data && Array.isArray(data.data)) {
//                     displayData(data.data);
//                 } else {
//                     console.error('Expected an array, but got:', data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         }
//        
//         function displayData(data) {
//             const results = document.getElementById('results');
//             results.innerHTML = '';
//             data.forEach(item => {
//                 const div = document.createElement('div');
//                 div.innerHTML = `<div>${item.contactName}</div>`;
//                 results.appendChild(div);
//             });
//         }

//         window.onload = fetchHotSearch;
//     }