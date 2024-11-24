
import homePage from '../pages/homePage.vue'

const routes = [
    { path: "/", redirect: '/homePage' },
    { path: "/homePage", name: "homePage", component: homePage},
    
]
 
export default routes
