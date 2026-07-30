const BASE_URL1 = "https://ordashbackend.onrender.com/api";
const BASE_URL = "http://192.168.0.110:3000/api";
export const API = {
  sellerSignup:    `${BASE_URL}/sellersignup`,
  sellerLogin:     `${BASE_URL}/sellerlogin`,
  sellerProfile:   `${BASE_URL}/sellerprofile`,
  sellerLogout:    `${BASE_URL}/logout`,

  // Products
  addProduct:      `${BASE_URL}/product/add`,
  getProducts:     `${BASE_URL}/product/all`,
  updateProduct:   (id: string) => `${BASE_URL}/product/update/${id}`,
  deleteProduct:   (id: string) => `${BASE_URL}/product/delete/${id}`,
  addCategory:     `${BASE_URL}/product/category/add`,
  getCategories:   `${BASE_URL}/product/categories`,

  // Tables
  addTable:        `${BASE_URL}/table/add`,
  getTables:       `${BASE_URL}/table/all`,
  updateTable:     (id: string) => `${BASE_URL}/table/update/${id}`,
  deleteTable:     (id: string) => `${BASE_URL}/table/delete/${id}`,

  // QR
  generateQR:      `${BASE_URL}/qr/generate`,
  getQR:           (tableId: string) => `${BASE_URL}/qr/${tableId}`,
  scanQR:          `${BASE_URL}/qr/scan`,

  // Menu (public)
  menuProducts:    (sellerId: string) => `${BASE_URL}/menu/products/${sellerId}`,
  menuCategories:  (sellerId: string) => `${BASE_URL}/menu/categories/${sellerId}`,

  // Orders
  placeOrder:      `${BASE_URL}/order/place`,
  tableOrders:     `${BASE_URL}/order/table`,
  sellerOrders:    `${BASE_URL}/order/seller`,
  updateOrderStatus: (orderId: string) => `${BASE_URL}/order/${orderId}/status`,
  requestBill:       (orderId: string) => `${BASE_URL}/order/${orderId}/bill`,

  // Accounts
  createAccount:   `${BASE_URL}/account/create`,
  getAccounts:     `${BASE_URL}/account/all`,
  deleteAccount:   (accountId: string) => `${BASE_URL}/account/delete/${accountId}`,
  updateAccount:   (accountId: string) => `${BASE_URL}/account/update/${accountId}`,
  
  
};

export { BASE_URL };
