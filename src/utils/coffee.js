const COFFEE_ORDERS_KEY = "love_confession_coffee_orders";
const CREATOR_PROFILE_KEY = "love_confession_creator_profile";

// Coffee preset amounts
export const COFFEE_PRESETS = [
  { id: "small", amount: 1, emoji: "☕", label: "Coffee", popular: false },
  { id: "medium", amount: 3, emoji: "☕☕", label: "Two Coffees", popular: true },
  { id: "large", amount: 5, emoji: "☕☕☕", label: "Big Coffee", popular: false },
  { id: "support", amount: 10, emoji: "🌟", label: "Project Support", popular: false },
];

// Minimum deposit for project request
export const MIN_PROJECT_DEPOSIT = 10;

// Create coffee order
export function createCoffeeOrder(orderData) {
  try {
    const orders = getCoffeeOrders();
    const order = {
      id: `coffee_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      buyer_user_id: orderData.buyer_user_id || null,
      creator_user_id: orderData.creator_user_id,
      amount: orderData.amount,
      currency: "USD",
      message: orderData.message || "",
      is_anonymous: orderData.is_anonymous || false,
      status: "pending",
      invoice_no: `INV-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      provider: "aba_khqr",
      provider_ref: null,
      created_at: new Date().toISOString(),
      paid_at: null,
    };
    
    orders.push(order);
    localStorage.setItem(COFFEE_ORDERS_KEY, JSON.stringify(orders));
    return order;
  } catch (error) {
    console.error("Error creating coffee order:", error);
    return null;
  }
}

// Get coffee orders
export function getCoffeeOrders() {
  try {
    const orders = localStorage.getItem(COFFEE_ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Error reading coffee orders:", error);
    return [];
  }
}

// Get coffee orders for a creator
export function getCreatorCoffeeOrders(creatorId) {
  const orders = getCoffeeOrders();
  return orders.filter(o => o.creator_user_id === creatorId && o.status === "paid");
}

// Get creator coffee stats
export function getCreatorCoffeeStats(creatorId) {
  const orders = getCreatorCoffeeOrders(creatorId);
  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalCount = orders.length;
  const latestSupporters = orders
    .sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
    .slice(0, 10);
  
  return {
    totalAmount,
    totalCount,
    latestSupporters,
  };
}

// Mark coffee order as paid
export function markCoffeeOrderPaid(orderId, providerRef = null) {
  try {
    const orders = getCoffeeOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = "paid";
      order.provider_ref = providerRef;
      order.paid_at = new Date().toISOString();
      localStorage.setItem(COFFEE_ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event("coffeeOrdersUpdated"));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error marking coffee order as paid:", error);
    return false;
  }
}

// Create project request
export function createProjectRequest(requestData) {
  try {
    const requests = getProjectRequests();
    const request = {
      id: `project_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      buyer_user_id: requestData.buyer_user_id || null,
      creator_user_id: requestData.creator_user_id,
      title: requestData.title,
      description: requestData.description,
      budget_min: requestData.budget_min || null,
      budget_max: requestData.budget_max || null,
      deadline_at: requestData.deadline_at || null,
      deposit_coffee_order_id: requestData.deposit_coffee_order_id || null,
      status: "open",
      created_at: new Date().toISOString(),
    };
    
    requests.push(request);
    localStorage.setItem("love_confession_project_requests", JSON.stringify(requests));
    window.dispatchEvent(new Event("projectRequestsUpdated"));
    return request;
  } catch (error) {
    console.error("Error creating project request:", error);
    return null;
  }
}

// Get project requests
export function getProjectRequests() {
  try {
    const requests = localStorage.getItem("love_confession_project_requests");
    return requests ? JSON.parse(requests) : [];
  } catch (error) {
    console.error("Error reading project requests:", error);
    return [];
  }
}

// Get creator profile
export function getCreatorProfile(userId) {
  try {
    const profiles = localStorage.getItem(CREATOR_PROFILE_KEY);
    const allProfiles = profiles ? JSON.parse(profiles) : [];
    return allProfiles.find(p => p.user_id === userId) || null;
  } catch (error) {
    console.error("Error reading creator profile:", error);
    return null;
  }
}

// Set creator profile
export function setCreatorProfile(profileData) {
  try {
    const profiles = localStorage.getItem(CREATOR_PROFILE_KEY);
    const allProfiles = profiles ? JSON.parse(profiles) : [];
    const existingIndex = allProfiles.findIndex(p => p.user_id === profileData.user_id);
    
    if (existingIndex >= 0) {
      allProfiles[existingIndex] = { ...allProfiles[existingIndex], ...profileData };
    } else {
      allProfiles.push({
        user_id: profileData.user_id,
        display_name: profileData.display_name || "Creator",
        bio: profileData.bio || "",
        coffee_enabled: true,
        payout_method: {},
        created_at: new Date().toISOString(),
        ...profileData,
      });
    }
    
    localStorage.setItem(CREATOR_PROFILE_KEY, JSON.stringify(allProfiles));
    return true;
  } catch (error) {
    console.error("Error setting creator profile:", error);
    return false;
  }
}
