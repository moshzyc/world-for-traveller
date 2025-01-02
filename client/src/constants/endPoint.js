const BASE_URL = "http://localhost:3000/"
const PRODUCTS_URL = BASE_URL + "products"
const GUIDE_URL = BASE_URL + "guide/"
const USER_URL = BASE_URL + "user/"

const SIGNUP_URL = USER_URL + "signup"
const LOGIN_URL = USER_URL + "login"
const LOGOUT_URL = USER_URL + "logout"
const GET_INFO_URL = USER_URL + "info"
const CART_URL = USER_URL + "cart"
const ORDER_URL = USER_URL + "save-order"
const ADD_PRODUCT_URL = PRODUCTS_URL + "/add"
const EDIT_PRODUCT_URL = PRODUCTS_URL + "/update/"
const GET_CATEGORIES_URL = PRODUCTS_URL + "/categories"
const ADD_GUIDE_URL = GUIDE_URL + "add"
const DELETE_GUIDE_URL = GUIDE_URL + "delete"
const EDIT_GUIDE_URL = GUIDE_URL + "update"
const GET_GUIDE_URL = GUIDE_URL + "get"
const USER_POSTS_URL = BASE_URL + "users-posts/"
const ADD_USER_POST_URL = USER_POSTS_URL + "add"
const DELETE_USER_POST_URL = USER_POSTS_URL + "delete/"
const EDIT_USER_POST_URL = USER_POSTS_URL + "update/"
const PLACES_URL = BASE_URL + "places/nearby"
const SEND_EMAIL_URL = BASE_URL + "email/send-order"
const GET_ALL_ORDERS_URL = USER_URL + "all-orders"
const UPDATE_ORDER_STATUS_URL = USER_URL + "update-order-status"
const GET_ALL_USERS_URL = USER_URL + "all-users"
const ADMIN_UPDATE_USER_URL = USER_URL + "admin-update-user"
const PRODUCTS_RECOMMENDATIONS_URL = PRODUCTS_URL + "/recommendations"

// Posts endpoints
export const POSTS_URL = `${BASE_URL}users-posts`
export const POST_CATEGORIES_URL = `${BASE_URL}users-posts/categories`
export const ADD_POST_URL = `${POSTS_URL}/add`
export const UPDATE_POST_URL = `${POSTS_URL}/update`
export const DELETE_POST_URL = `${POSTS_URL}/delete`
export const GET_ALL_POSTS_URL = `${BASE_URL}users-posts/all`
export const GET_USER_POSTS_URL = `${BASE_URL}users-posts/by-user`
const GET_POST_BY_ID_URL = `${BASE_URL}users-posts/post`

export {
  SIGNUP_URL,
  LOGIN_URL,
  GET_INFO_URL,
  LOGOUT_URL,
  PRODUCTS_URL,
  GET_CATEGORIES_URL,
  CART_URL,
  ORDER_URL,
  ADD_PRODUCT_URL,
  EDIT_PRODUCT_URL,
  USER_URL,
  ADD_GUIDE_URL,
  EDIT_GUIDE_URL,
  GET_GUIDE_URL,
  DELETE_GUIDE_URL,
  USER_POSTS_URL,
  ADD_USER_POST_URL,
  DELETE_USER_POST_URL,
  EDIT_USER_POST_URL,
  PLACES_URL,
  SEND_EMAIL_URL,
  GET_ALL_ORDERS_URL,
  UPDATE_ORDER_STATUS_URL,
  GET_ALL_USERS_URL,
  ADMIN_UPDATE_USER_URL,
  PRODUCTS_RECOMMENDATIONS_URL,
  GET_POST_BY_ID_URL,
}
