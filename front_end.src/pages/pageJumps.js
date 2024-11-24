import router from "../router/router.js"

export function pageJump(pageName) {

   function getPageName() {
    router.push({name: pageName})
    }
}