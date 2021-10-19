//начальное состояние
let postsArray = []
let filtredArray = []
let startIndex = 0
const limit = 10
let stopIndex = startIndex + limit
const fetchUrl = 'https://jsonplaceholder.typicode.com/posts'

// запрос на сервер, получение постов, сохранение в состоянии и передача для отрисовки, обработка ошибок

const fetchPosts = async () => {
  fetch(fetchUrl)
    .then((Response) => Response.json())
    .then((posts) => (postsArray = [...posts]))
    .then(() => showPosts(filtredArray.length ? filtredArray : postsArray))
    .catch((error) => console.log(error))
}
// создание элемента поста
const createPost = (post) => {
  const postElement = document.createElement('div')
  postElement.className = 'post'
  postElement.innerHTML = `
  <h3> ${post.title} <button onclick = deletePost(${post.id}) id="deleteBtn">&#10006;</button></h3> </h3>
  <p>${post.body}</p>
  `
  return postElement
}
// отрисовка постов, полученных с сервера, или при фильтрации, макс 10 шт. на странице, отрисовка элемента пагинации
const showPosts = (posts) => {
  const postList = document.getElementById('postList')
  postList.innerHTML = ''
  for (let i = startIndex; i < stopIndex; i++) {
    const post = posts[i]
    if (post) {
      postList.append(createPost(post))
    }
  }
  createPagination(filtredArray.length ? filtredArray : postsArray)
}
// создание элемента пагинации в зависимости от кол-ва постов
const createPagination = (posts) => {
  const pagination = document.getElementById('pagination')
  pagination.innerHTML = ''
  for (let i = 1; i <= Math.ceil(posts.length / limit); i++) {
    const pageItem = document.createElement('button')
    pageItem.textContent = i
    pageItem.className = ''
    pageItem.onclick = () => {
      changePage(i - 1)
    }
    pagination.append(pageItem)
  }
}
// смена страницы пагинации, стиль для текущей страницы не реализовал
const changePage = (pageNumber) => {
  startIndex = pageNumber * 10
  stopIndex = startIndex + limit
  showPosts(postsArray)
}
// фильтрация массива постов по строке поиска, сохранение в новый массив
// при поиске страница переклчается на 1ю
let searchField = document.getElementById('searchField')
searchField.oninput = () => searchPost(event)
const searchPost = (event) => {
  filtredArray = []
  let searchQuery = event.target.value
  if (searchQuery.trim()) {
    startIndex = 0
    filtredArray = [
      ...postsArray.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ]
    showPosts(filtredArray)
  } else {
    showPosts(postsArray)
  }
}
// удаление поста из массива
const deletePost = (postId) => {
  postsArray = postsArray.filter((post) => post.id !== postId)
  showPosts(postsArray)
}

const addButton = document.getElementById('addPost')
const addPostForm = document.getElementById('addPostForm')
const submitBtn = document.getElementById('submitPost')
// создание загаловка поста
let postTitle = ''
const setTitle = (event) => {
  postTitle = event.target.value
}
// создание содержания поста
let postBody = ''
const setBody = (event) => {
  postBody = event.target.value
}
let title = document.getElementById('postTitle')
let body = document.getElementById('postBody')
title.onchange = () => setTitle(event)
body.onchange = () => setBody(event)
// добавление поста в начало массива
const addPost = (event) => {
  event.preventDefault()
  if (postTitle.trim() && postBody.trim()) {
    let post = { id: Date.now(), title: postTitle, body: postBody }
    postsArray.unshift(post)
    showPosts(postsArray)
    title.value = ''
    body.value = ''
  }
  addPostForm.style.display = 'none'
}

submitBtn.onclick = () => addPost(event)
addButton.onclick = () => (addPostForm.style.display = 'block')
// старт приложения
fetchPosts()
