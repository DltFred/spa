import { PostCard } from "../components/PostCard.js"
import { SearchCard } from "../components/SearchCard.js"
import { ajax } from "./ajax.js"
import wp_api from "./wp_api.js"

export async function infinite_scroll() {
  const d = document,
    w = window
  let query = localStorage.getItem('wpSearch'),
    apiUrl, Component

  w.addEventListener('scroll', async () => {
    let { scrollTop, clientHeight, scrollHeight } = d.documentElement,
      { hash } = w.location

    if (scrollTop + clientHeight >= scrollHeight) {
      wp_api.page++
      if (!hash || hash === '#/') {
        apiUrl = `${wp_api.POSTS}&page=${wp_api.page}`
        Component = PostCard
      } else if (hash.includes('#/search')) {
        apiUrl = `${wp_api.SEARCH}${query}&page=${wp_api.page}`
        Component = SearchCard
      } else {
        return false
      }
      d.querySelector('.loader').style.display = 'block'

      await ajax({
        url: apiUrl,
        cbSuccess: (posts) => {
          let html = ''
          posts.forEach(post => html += Component(post))
          d.getElementById('main').insertAdjacentHTML('beforeend', html)
          d.querySelector('.loader').style.display = 'none'
        }
      })
    }
  })
}