import { ajax } from "../helpers/ajax.js"
import wp_api from "../helpers/wp_api.js"
import { Post } from "./Post.js"
import { PostCard } from "./PostCard.js"
import { SearchCard } from "./SearchCard.js"

export async function Router() {
  const d = document,
    $main = d.getElementById('main')
  let { hash } = location

  $main.innerHTML = null

  if (!hash || hash === '#/') {
    await ajax({
      url: wp_api.POSTS,
      cbSuccess: (posts) => {
        let html = ''
        posts.forEach(post => {
          html += PostCard(post)
        })
        d.getElementById('main').innerHTML = html
      }
    })
  }

  else if (hash.includes('#/search')) {
    let query = localStorage.getItem('wpSearch')

    if (!query) {
      d.querySelector('.loader').style.display = 'none'
      return false
    }


    await ajax({
      url: `${wp_api.SEARCH}${query}`,
      cbSuccess: (search) => {
        let html = ''
        if (search.length === 0) {
          html = `
            <p class="error"> No existen resultados para:  <b>${query}</b></p>
            `
        } else {
          search.forEach(post => html += SearchCard(post))
        }

        $main.innerHTML = html
      }
    })
  }

  else {
    await ajax({
      url: `${wp_api.POST}/${localStorage.getItem('wpPostId')}`,
      cbSuccess: (post) => {
        $main.innerHTML = Post(post)
      }
    })
  }

  d.querySelector('.loader').style.display = 'none'
}